import { expect } from '@playwright/test';
import { parseMoney } from '../utils//money';

export class AccountsOverviewPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.accountLinks = page.locator('#accountTable a');
    this.accountRows = page.locator('#accountTable tbody tr');
  }

  async open() {
    await this.page.goto('overview.htm');
    await expect(this.accountLinks.first()).toBeVisible();
  }

  async getAccountNumbers() {
    await expect(this.accountLinks.first()).toBeVisible();
    return await this.accountLinks.allTextContents();
  }

  async getBalance(accountNumber) {
    const row = this.accountRows.filter({ hasText: accountNumber });
    const balanceCell = row.locator('td').nth(1);

    await expect(balanceCell).toHaveText(/\$/);
    const text = await balanceCell.textContent();

    return parseMoney(text);
  }

  async getTotal() {
    const row = this.accountRows.filter({ hasText: 'Total' });
    const totalBalanceCell = row.locator('td').nth(1);

    await expect(totalBalanceCell).toHaveText(/\$/);
    const text = await totalBalanceCell.textContent();

    return parseMoney(text);
  }
}
