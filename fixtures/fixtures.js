import { test as base, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { createCustomer } from '../utils/testData.js';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage.js';
import { OpenAccountPage } from '../pages/OpenAccountPage.js';
import { AccountDetailsPage } from '../pages/AccountDetailsPage.js';

export const test = base.extend({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registeredCustomer: async ({ page, registerPage }, use) => {
    const customer = createCustomer();

    await registerPage.open();
    await registerPage.register(customer);
    await page.getByRole('link', { name: 'Log Out' }).click();

    await use(customer);
  },

  loggedInCustomer: async ({ registerPage }, use) => {
    const customer = createCustomer();

    await registerPage.open();
    await registerPage.register(customer);

    await use(customer);
  },

  accountsOverviewPage: async ({ page }, use) => {
    await use(new AccountsOverviewPage(page));
  },

  openAccountPage: async ({ page }, use) => {
    await use(new OpenAccountPage(page));
  },

  accountDetailsPage: async ({ page }, use) => {
    await use(new AccountDetailsPage(page));
  },
});

export { expect };
