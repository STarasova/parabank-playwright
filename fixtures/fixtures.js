import { test as base, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { createCustomer } from '../utils/testData.js';

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
});

export { expect };
