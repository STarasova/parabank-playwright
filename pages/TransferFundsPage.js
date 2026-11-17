import { expect } from '@playwright/test';

export class TransferFundsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.amountInput = page.locator('[id ="amount"]');
    this.fromAccountSelect = page.locator('[id="fromAccountId"]');
    this.toAccountSelect = page.locator('[id ="toAccountId"]');
    this.transferButton = page.getByRole('button', { name: 'Transfer' });
    this.showResult = page.locator('[id="showResult"]');
    this.errorMessage = page.locator('#showError');
  }

  async open() {
    await this.page.goto('transfer.htm');
    await expect(this.fromAccountSelect.locator('option').first()).toBeAttached();
  }
  async fillForm(amount, fromAccount, toAccount) {
    await this.amountInput.fill(String(amount));
    await this.fromAccountSelect.selectOption(fromAccount);
    await this.toAccountSelect.selectOption(toAccount);
  }
  async submit() {
    await this.transferButton.click();
  }

  async transfer(amount, fromAccount, toAccount) {
    await this.fillForm(amount, fromAccount, toAccount);
    await this.submit();
    await expect(this.showResult).toBeVisible();
  }
}
