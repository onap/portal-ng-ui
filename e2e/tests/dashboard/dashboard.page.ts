import type { Locator, Page } from '@playwright/test';

export class DashboardPage {
  readonly dashboardHeading: Locator = this.page.locator('h2.qa_title');
  readonly dropDown: Locator = this.page.locator('#dropdownColumnSettings');
  readonly lastActionTile: Locator = this.page.locator('.qa_user_last_action_tile');
  readonly lastActionInput: Locator = this.page.locator('input.qa_dashboard_show_app_USER_LAST_ACTION_TILE');
  readonly actionRows = this.page.locator('#qa-div-action-rows app-action-row');


  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/dashboard');
  }
}
