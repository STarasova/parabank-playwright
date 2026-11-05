import { expect } from '@playwright/test';
import { createCustomer } from '../utils/testData';

export class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.logInButton = page.getByRole('button', { name: 'Log In' });
    this.loginPanel = page.getByText('Username Password Log In');
  }

  async open() {
    await this.page.goto('index.htm');
    await expect(this.loginPanel).toBeVisible();
  }

  async logIn(customer) {
    await this.username.fill(customer.username);
    await this.password.fill(customer.password);
    await this.logInButton.click();
  }
}
