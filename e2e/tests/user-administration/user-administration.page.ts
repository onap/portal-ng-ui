import type { Locator, Page } from '@playwright/test';

export class UserAdministrationPage {
  readonly userAdministrationHeading: Locator = this.page.locator('h2.qa_user_administration_list_title');

  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/dashboard');
    await this.page.getByRole('link', { name: 'Users' }).click();
  }
}
