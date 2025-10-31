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
import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';

// Declare the storage state path where the authentication will be saved
const authFile = 'playwright/.auth/user.json';

// const data = fs.readFileSync('playwright/.auth/credentials.json', 'utf-8');
// const credentials = JSON.parse(data);

const username = 'onap-admin';
const password = 'password';

setup('Login and save authentication state', async ({ page }) => {
  // Navigate to your app; this should trigger the redirect to Keycloak
  await page.goto('http://localhost:4200');

  // Wait for the Keycloak login page to load by checking for the username input
  // const currentURL = new URL(page.url());
  // expect(currentURL.hostname).toContain('keycloak');
  await page.waitForSelector('#username'); // Adjust selectors depending on Keycloak page structure
  await page.waitForSelector('#password');

  // Fill in the username and password
  await page.fill('#username', username);
  await page.fill('#password', password);

  // Click the login button (adjust selector as needed)
  await page.click('#kc-login'); // Default ID for Keycloak login button

  // Wait for the redirect back to the application
  await page.waitForURL('http://localhost:4200/**');

  // Check that the login was successful by ensuring you're on the app page
  expect(page.url()).toContain('http://localhost:4200');

  // Save the authentication state to a file
  await page.context().storageState({ path: authFile });
  console.log('Authentication state has been saved.');
});
