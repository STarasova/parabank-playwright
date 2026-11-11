import { expect } from '@playwright/test';

export class OpenAccountPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.fromAccountSelect = page.locator('[id="fromAccountId"]');
    this.accountTypeSelect = page.locator('#type');
    this.openAccountButton = page.getByRole('button', { name: 'Open New Account' });
    this.newAccountNumber = page.locator('#newAccountId');
  }

  async open() {
    await this.page.goto('openaccount.htm');
    await expect(this.fromAccountSelect.locator('option').first()).toBeAttached();
  }

  async openNewAccount(type) {
    await this.chooseAccountType(type);
    await this.submit();
  }

  async chooseAccountType(type) {
    await this.accountTypeSelect.selectOption(type);
  }

  async submit() {
    await this.openAccountButton.click();
  }

  async getNewAccountNumber() {
    await expect(this.newAccountNumber).toHaveText(/^\d+$/);
    return await this.newAccountNumber.textContent();
  }
}
