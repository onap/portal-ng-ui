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
  });

  test('Verify Cards Titles and Links', async ({ page }) => {
    // List of expected card titles and their links
    const cards = [
      { title: 'Service Design and Creation (SDC)', link: 'https://sdc-ui-localhost/sdc1/portal' },
      { title: 'Policy Framework', link: 'https://policy-ui-localhost/' },
      { title: 'Service Orchestration (SO) Monitoring', link: 'https://so-monitoring-ui-localhost/' },
      { title: 'Controller Design Studio (CDS)', link: 'https://cds-ui-localhost/' },
      { title: 'Holmes Rules', link: 'https://holmes-ui-localhost/iui/holmes/default.html' },
      { title: 'A&AI Browser', link: 'https://aai-ui-localhost/services/aai/webapp/index.html#/browse' },
      { title: 'DCAE Microservice Onboarding & Design (DCAE MOD)', link: 'https://dcaemod-ui-localhost/nifi/' },
      { title: 'SDN-C Directed Graph Builder (SDC-C DGB)', link: 'https://sdncdg-ui-localhost/' },
      { title: 'SDN-C Open Daylight UI (SDN-C ODL)', link: 'https://sdncodl-ui-localhost//odlux/index.html' },
      { title: 'Non-RT RIC', link: 'https://nonrtric-controlpanel-localhost/' },
    ];

    // Locate all cards
    const cardElements = await page.locator('.qa_tiles_wrapper');

    // Verify the number of cards matches the expected count
    await expect(cardElements).toHaveCount(cards.length);

    // Verify each card's title and link
    for (const [index, card] of cards.entries()) {
      const cardLocator = cardElements.nth(index);

      // Assert the card title
      const actualTitle = await cardLocator.locator('.qa_tiles_not_disabled_title').innerText();
      expect(actualTitle).toBe(card.title);

      // Assert the card link
      const actualLink = await cardLocator.locator('a').getAttribute('href');
      expect(actualLink).toBe(card.link);
    }
  });

});
