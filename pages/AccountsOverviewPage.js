import { expect } from '@playwright/test';

export class AccountsOverviewPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.accountLinks = page.locator('#accountTable a');
  }

  async open() {
    await this.page.goto('overview.htm');
    await expect(this.accountLinks.first()).toBeVisible();
  }

  async getAccountNumbers() {
    await expect(this.accountLinks.first()).toBeVisible();
    return await this.accountLinks.allTextContents();
  }
}
