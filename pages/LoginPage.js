import { expect } from '@playwright/test';

export class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.logInButton = page.getByRole('button', { name: 'Log In' });
    this.loginPanel = page.getByText('Username Password Log In');
  }

  async open() {
    await this.page.goto('index.htm');
    await expect(this.loginPanel).toBeVisible();
  }

  async logIn(customer) {
    await this.usernameInput.fill(customer.username);
    await this.passwordInput.fill(customer.password);
    await this.logInButton.click();
  }
}
