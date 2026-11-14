import { expect } from '@playwright/test';

export class TransferFundsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.amountInput = page.locator('[id ="amount"]');
    this.fromAccountSelect = page.locator('[id="fromAccountId"]');
    this.toAccountSelect = page.locator('[id="toAccountId"]');
    this.transferButton = page.getByRole('button', { name: 'Transfer' });
    this.successPanel = page.locator('[id="showResult"]');
  }

  async open() {
    await this.page.goto('transfer.htm');
    await expect(this.fromAccountSelect.locator('option').first()).toBeAttached();
  }

  async submit() {
    await this.transferButton.click();
  }

  async transfer(amount, fromAccount, toAccount) {
    await this.amountInput.fill(String(amount));
    await this.fromAccountSelect.selectOption(fromAccount);
    await this.toAccountSelect.selectOption(toAccount);
    await this.submit();
    await expect(this.successPanel).toBeVisible();
  }
}
