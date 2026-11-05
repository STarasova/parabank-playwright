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
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
  });

  test('AUTH-02 - login with invalid password', async ({ page }) => {
    //test.fail(true, 'Known bug: ParaBank accepts any password for an existing username');

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.logIn({ ...customer, password: 'WrongPassword1!' });
    await expect(page.getByText('The username and password could not be verified.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).not.toBeVisible();
  });

  test('AUTH-03 - login with empty froms display error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.clickLogInButton();
    await expect(page.getByText('Please enter a username and password.')).toBeVisible();
  });

  test('AUTH-04 - no access after user is logged out', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.logIn(customer);
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
    await page.getByRole('link', { name: 'Log Out' }).click();
    await expect(loginPage.logInButton).toBeVisible();
    await page.goto('overview.htm');
    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
  });
});
