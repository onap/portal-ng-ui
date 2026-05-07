/*
 * Copyright (c) 2026. Deutsche Telekom AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, expect } from '@playwright/test';

test.describe('OpenTelemetry Tracing', () => {
  test('exports traces with valid spans when navigating to dashboard', async ({ page }) => {
    const exportedBatches: any[] = [];

    // Intercept OTLP trace export requests
    await page.route('**/otlp/v1/traces', route => {
      const request = route.request();
      const postData = request.postDataJSON();
      if (postData) {
        exportedBatches.push(postData);
      }
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{}',
      });
    });

    // Enable tracing via runtime config override before the page loads
    await page.addInitScript(() => {
      window['env'] = window['env'] || {};
      window['env']['tracingEnabled'] = 'true';
      window['env']['tracingCollectorUrl'] = '/otlp/v1/traces';
      window['env']['tracingServiceName'] = 'portal-ng-ui-e2e';
    });

    // Navigate to dashboard — this triggers API calls which should produce traces
    await page.goto('/dashboard');

    // Wait for the dashboard to be fully loaded
    await expect(page.locator('h2.qa_title')).toBeVisible();

    // Give the BatchSpanProcessor time to flush (default flush interval is 5s)
    await page.waitForTimeout(6000);

    // Verify that trace export requests were made
    expect(exportedBatches.length).toBeGreaterThan(0);

    // Verify the trace data structure
    const batch = exportedBatches[0];
    expect(batch).toHaveProperty('resourceSpans');
    expect(batch.resourceSpans.length).toBeGreaterThan(0);

    const resourceSpan = batch.resourceSpans[0];

    // Verify the service name resource attribute
    const resourceAttributes = resourceSpan.resource.attributes;
    const serviceNameAttr = resourceAttributes.find(
      (attr: any) => attr.key === 'service.name'
    );
    expect(serviceNameAttr).toBeDefined();
    expect(serviceNameAttr.value.stringValue).toBe('portal-ng-ui-e2e');

    // Verify spans exist
    const scopeSpans = resourceSpan.scopeSpans;
    expect(scopeSpans.length).toBeGreaterThan(0);

    const spans = scopeSpans.flatMap((ss: any) => ss.spans);
    expect(spans.length).toBeGreaterThan(0);

    // Verify each span has required fields
    for (const span of spans) {
      expect(span.traceId).toBeTruthy();
      expect(span.spanId).toBeTruthy();
      expect(span.name).toBeTruthy();
      expect(span.startTimeUnixNano).toBeTruthy();
      expect(span.endTimeUnixNano).toBeTruthy();
    }
  });

  test('propagates W3C traceparent header on API requests', async ({ page }) => {
    const traceparentHeaders: string[] = [];

    // Enable tracing before page loads
    await page.addInitScript(() => {
      window['env'] = window['env'] || {};
      window['env']['tracingEnabled'] = 'true';
      window['env']['tracingCollectorUrl'] = '/otlp/v1/traces';
    });

    // Intercept OTLP exports (just fulfill them)
    await page.route('**/otlp/v1/traces', route => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    // Listen for API requests to capture traceparent headers
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        const traceparent = request.headers()['traceparent'];
        if (traceparent) {
          traceparentHeaders.push(traceparent);
        }
      }
    });

    await page.goto('/dashboard');
    await expect(page.locator('h2.qa_title')).toBeVisible();

    // The dashboard loads actions and preferences via /api/ calls
    expect(traceparentHeaders.length).toBeGreaterThan(0);

    // Verify traceparent format: version-traceId-spanId-flags (e.g., 00-abc123...-def456...-01)
    for (const header of traceparentHeaders) {
      expect(header).toMatch(/^00-[a-f0-9]{32}-[a-f0-9]{16}-[0-9a-f]{2}$/);
    }
  });
});
