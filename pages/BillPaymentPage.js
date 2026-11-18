import { expect } from '@playwright/test';

export class BillPaymentPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.addressInput = page.locator('input[name="payee.address.street"]');
    this.cityInput = page.locator('input[name="payee.address.city"]');
    this.stateInput = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
    this.phoneInput = page.locator('input[name="payee.phoneNumber"]');
    this.accountInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountSelect = page.locator('select[name="fromAccountId"]');

    this.sendPaymentButton = page.getByRole('button', { name: 'Send Payment' });

    this.accountMismatchError = page.locator('#validationModel-verifyAccount-mismatch');
    this.invalidAccountError = page.locator('#validationModel-amount-invalid');
  }

  async open() {
    await this.page.goto('billpay.htm');
    await expect(this.fromAccountSelect.locator('option').first()).toBeAttached();
  }

  async fillForm(payee, amount, fromAccount) {
    await this.payeeNameInput.fill(payee.payeeName);
    await this.addressInput.fill(payee.address);
    await this.cityInput.fill(payee.city);
    await this.stateInput.fill(payee.state);
    await this.zipCodeInput.fill(payee.zipCode);
    await this.phoneInput.fill(payee.phone);
    await this.accountInput.fill(payee.account);
    await this.verifyAccountInput.fill(payee.verifyAccount);

    await this.amountInput.fill(String(amount));

    await this.fromAccountSelect.selectOption(fromAccount);
  }

  errorFor(fieldId) {
    return this.page.locator(`[id="validationModel-${fieldId}"]`);
  }

  async submit() {
    await this.sendPaymentButton.click();
  }

  async pay(payee, amount, fromAccount) {
    await this.fillForm(payee, amount, fromAccount);
    await this.submit();

    await expect(this.page.locator('#billpayResult')).toBeVisible();
  }
}
