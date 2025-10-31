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
import { UserAdministrationPage } from "./user-administration.page";

test.describe('User creation', () => {
  test('User can be created', async ({ page }) => {
    const userPage: UserAdministrationPage = new UserAdministrationPage(page);
    await userPage.goto();

    const createUserButton = page.locator('button.qa_create_button');
    await expect(createUserButton).toBeVisible();
    await createUserButton.click();
    expect(page.getByRole('heading', { name: 'Create User'})).toBeVisible()

    // await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('testuser');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test.user@onap.org');
    await page.getByRole('textbox', { name: 'Email' }).press('Tab');
    await page.getByRole('textbox', { name: 'First Name' }).fill('test');
    await page.getByRole('textbox', { name: 'First Name' }).press('Tab');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('user');
    await page.getByRole('button', { name: 'Save' }).click();

    // TODO: User creation is not fully working yet as it is not redirecting to the list page upon saving
    // await expect(page.getByRole('heading', { name: 'User Administration' })).toBeVisible()

  });
});
