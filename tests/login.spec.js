import { test, expect } from '@playwright/test';
import { createCustomer } from '../utils/testData';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {
  let customer;
  test.beforeEach(async ({ page }) => {
    customer = createCustomer();
    const registerPage = new RegisterPage(page);

    await registerPage.open();
    await registerPage.register(customer);
    await page.getByRole('link', { name: 'Log Out' }).click();
  });

  test('AUTH-01 - login with valid username and valid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.logIn(customer);
  });

  test('AUTH-02 - login with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.logIn({ ...customer, password: 'WrongPassword1!' });
  });
});
