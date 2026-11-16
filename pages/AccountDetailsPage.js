import { expect } from '@playwright/test';
import { parseMoney } from '../utils/money.js';

export class AccountDetailsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.accountNumber = page.locator('#accountId');
    this.accountType = page.locator('[id="accountType"]');
    this.transactionRows = page.locator('#transactionTable tbody tr');
  }

  async open(accountNumber) {
    await this.page.goto(`activity.htm?id=${accountNumber}`);
    await expect(this.accountNumber).toHaveText(accountNumber);
  }

  async getTransaction(amount) {
    const row = this.transactionRows.filter({ hasText: `$${amount.toFixed(2)}` });
    await expect(row).toBeVisible();

    const cells = row.locator('td');

    return {
      description: await cells.nth(1).textContent(),
      debit: parseMoney(await cells.nth(2).textContent()),
      credit: parseMoney(await cells.nth(3).textContent()),
    };
  }
}
