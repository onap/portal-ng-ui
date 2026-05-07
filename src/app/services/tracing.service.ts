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

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { Environment } from '../model/environment.model';

export function initTracing(environment: Environment): void {
  const windowEnv = (window as any)?.env;
  const enabled = windowEnv?.tracingEnabled === 'true' || windowEnv?.tracingEnabled === true || environment.tracing.enabled;
  if (!enabled) {
    return;
  }

  const collectorUrl = windowEnv?.tracingCollectorUrl || environment.tracing.collectorUrl;
  const serviceName = windowEnv?.tracingServiceName || environment.tracing.serviceName;

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_VERSION]: '1.0.0',
  });

  const exporter = new OTLPTraceExporter({
    url: collectorUrl,
  });

  const provider = new WebTracerProvider({
    resource,
    spanProcessors: [new BatchSpanProcessor(exporter)],
  });

  provider.register({
    contextManager: new ZoneContextManager(),
  });

  const apiUrlPrefix = environment.backendServerUrl.toLowerCase();

  registerInstrumentations({
    instrumentations: [
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: [new RegExp(escapeRegExp(apiUrlPrefix))],
        ignoreUrls: [/\/onap_logging/, /\/auth\//, /\/realms\//],
      }),
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [new RegExp(escapeRegExp(apiUrlPrefix))],
        ignoreUrls: [/\/onap_logging/, /\/auth\//, /\/realms\//],
      }),
      new DocumentLoadInstrumentation(),
      new UserInteractionInstrumentation({
        eventNames: ['click'],
      }),
    ],
  });
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
