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
import { test, expect } from "@playwright/test";

test.beforeEach('Open app-starter', async ({page}) => {
  await page.goto('/dashboard');
  await page.getByRole('link', { name: 'App Starter' }).click();
})

test.describe('App Starter', () => {
  test('Tiles are visible', async ({page}) => {
    await expect(page.getByRole('heading', {name: 'App Starter'})).toBeVisible();
  })
});
