/*
 * Copyright (c) 2025. Deutsche Telekom AG
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
import { DashboardPage } from './dashboard.page';

test.describe('Dashboard', () => {
  test('Dashboard is visible', async ({ page }) => {
    const dashboardPage: DashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    await expect(dashboardPage.dashboardHeading).toBeVisible();
    expect(dashboardPage.dashboardHeading).toHaveText('Dashboard');
  });

  test('Last user action tile is visible', async ({ page }) => {
    const dashboardPage: DashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    await expect(dashboardPage.lastActionTile).toBeVisible();

    // Assert that there are exactly 1 such elements
    await expect(dashboardPage.actionRows).toHaveCount(1);
    expect(dashboardPage.actionRows.nth(0)).toContainText('10:34');
  });

  test('Last user action tile can be hidden', async ({ page }) => {
    const dashboardPage: DashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    await expect(dashboardPage.lastActionTile).toBeVisible();
    expect(dashboardPage.dropDown)
    dashboardPage.dropDown.click()
    await expect(dashboardPage.lastActionInput).toBeVisible()
    dashboardPage.lastActionInput.uncheck()
    await expect(dashboardPage.lastActionTile).toHaveCount(0)
    dashboardPage.lastActionInput.check()
    await expect(dashboardPage.lastActionInput).toBeVisible()
  });
});
