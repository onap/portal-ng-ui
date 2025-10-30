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

test.describe('User adminstration', () => {
  test('User adminstration is visible', async ({ page }) => {
    const userPage: UserAdministrationPage = new UserAdministrationPage(page);
    await userPage.goto();

    await expect(userPage.userAdministrationHeading).toBeVisible();
    expect(userPage.userAdministrationHeading).toHaveText('User Administration');
  });
  test('Users table is working', async ({ page }) => {
    const userPage: UserAdministrationPage = new UserAdministrationPage(page);
    await userPage.goto();

    const rows = page.locator('.table-responsive tbody tr');

    const numRows = await rows.count();
    expect(numRows).toBe(10);

    const expectedUsers = [
      { username: 'john.doe', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      { username: 'jane.smith', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
      { username: 'sam.green', firstName: 'Sam', lastName: 'Green', email: 'sam.green@example.com' },
      { username: 'emily.white', firstName: 'Emily', lastName: 'White', email: 'emily.white@example.com' },
      { username: 'michael.brown', firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@example.com' },
      { username: 'claire.jones', firstName: 'Claire', lastName: 'Jones', email: 'claire.jones@example.com' },
      { username: 'david.martin', firstName: 'David', lastName: 'Martin', email: 'david.martin@example.com' },
      { username: 'lisa.miller', firstName: 'Lisa', lastName: 'Miller', email: 'lisa.miller@example.com' },
      { username: 'robert.taylor', firstName: 'Robert', lastName: 'Taylor', email: 'robert.taylor@example.com' },
      { username: 'sarah.wilson', firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.wilson@example.com' },
    ];

    for (let i = 0; i < numRows; i++) {
      const row = rows.nth(i);

      const username = await row.locator('td:nth-child(1)').innerText();
      const firstName = await row.locator('td:nth-child(2)').innerText();
      const lastName = await row.locator('td:nth-child(3)').innerText();
      const email = await row.locator('td:nth-child(4) a').innerText();

      expect(username).toBe(expectedUsers[i].username);
      expect(firstName).toBe(expectedUsers[i].firstName);
      expect(lastName).toBe(expectedUsers[i].lastName);
      expect(email).toBe(expectedUsers[i].email);
    }

    await expect(userPage.userAdministrationHeading).toBeVisible();
    expect(userPage.userAdministrationHeading).toHaveText('User Administration');
  });
});
