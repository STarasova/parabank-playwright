import { expect } from '@playwright/test';

export class AccountDetailsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.accountNumber = page.locator('#accountId');
    this.accountType = page.locator('[id="accountType"]');
  }

  async open(accountNumber) {
    await this.page.goto(`activity.htm?id=${accountNumber}`);
    await expect(this.accountNumber).toHaveText(accountNumber);
  }
}
