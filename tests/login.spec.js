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

  test('AUTH-01: logs in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(customer);
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
  });

  test('AUTH-02: rejects a wrong password', async ({ page }) => {
    //test.fail(true, 'Known bug: ParaBank accepts any password for an existing username');

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login({ ...customer, password: 'WrongPassword1!' });
    await expect(page.getByText('The username and password could not be verified.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).not.toBeVisible();
  });

  test('AUTH-04: blocks account pages after logout', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(customer);
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
    await page.getByRole('link', { name: 'Log Out' }).click();
    await expect(loginPage.logInButton).toBeVisible();
    await page.goto('overview.htm');
    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).not.toBeVisible();
  });
});

test('AUTH-03: shows an error when fields are empty', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.submit();
  await expect(page.getByText('Please enter a username and password.')).toBeVisible();
});
