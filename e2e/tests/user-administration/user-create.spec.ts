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

test.beforeEach('Open user administration', async ({page}) => {
  const userPage: UserAdministrationPage = new UserAdministrationPage(page);
  await userPage.goto();

  // navigate to user creation
  await page.locator('button.qa_create_button').click();
})

test.describe('User creation', () => {
  test('Available roles are visible', async ({page}) => {
    const availableRolesContainer = page.locator('#qa_available_roles_container');
    await expect(availableRolesContainer).toBeVisible()

    const availableRoles = availableRolesContainer.locator('input.qa_checkbox_available');
    await expect(availableRoles).toHaveCount(2);
    await expect(availableRoles.nth(0)).toHaveValue('ADMIN12345');
    await expect(await availableRoles.nth(0).getAttribute('aria-labelledby')).toBe('portal_admin');
    await expect(availableRoles.nth(1)).toHaveValue('USER67890');
    await expect(await availableRoles.nth(1).getAttribute('aria-labelledby')).toBe('portal_operator');
    await expect(page.locator('label#portal_admin')).toHaveText('portal_admin');
    await expect(page.locator('label#portal_operator')).toHaveText('portal_operator');
  })

  test('Roles can be checked and unchecked', async ({page}) => {
    const availableRolesContainer = page.locator('#qa_available_roles_container');
    // selector ensures that the input is inside the available roles container
    // (and not in the assigned roles one)
    const portalAdminCheckbox = availableRolesContainer.locator('input.qa_checkbox_available[aria-labelledby="portal_admin"]');
    await expect(portalAdminCheckbox).toBeVisible();

    await page.getByRole('checkbox', { name: 'portal_admin' }).check()

    // checkbox not present in the available roles container
    await expect(portalAdminCheckbox).toHaveCount(0)
    // checkbox instead present in the assigned roles container
    const assignedRolesContainer = page.locator('#qa_assigned_roles_container');
    const portalAdminCheckboxAssigned = assignedRolesContainer.locator('input.qa_checkbox_assigned[aria-labelledby="portal_admin"]');
    await expect(portalAdminCheckboxAssigned).toBeVisible();

    // uncheck and assert that the checkbox is present in the
    // available roles container again
    await page.getByRole('checkbox', { name: 'portal_admin' }).uncheck()
    await expect(portalAdminCheckbox).toBeVisible();
  })

  test('User can be created', async ({ page }) => {
    expect(page.getByRole('heading', { name: 'Create User'})).toBeVisible()

    // await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('testuser');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test.user@onap.org');
    await page.getByRole('textbox', { name: 'Email' }).press('Tab');
    await page.getByRole('textbox', { name: 'First Name' }).fill('test');
    await page.getByRole('textbox', { name: 'First Name' }).press('Tab');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('user');

    // TODO: User creation is not fully working yet as it is not redirecting to the list page upon saving
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'User Administration' })).toBeVisible()

  });
});
