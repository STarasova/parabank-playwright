import { test, expect } from '../fixtures/fixtures.js';

test('AUTH-01: logs in with valid credentials', async ({ page, loginPage, registeredCustomer }) => {
  await loginPage.open();
  await loginPage.login(registeredCustomer);
  await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
});

test('AUTH-02: rejects a wrong password', async ({ page, loginPage, registeredCustomer }) => {
  await loginPage.open();
  await loginPage.login({ ...registeredCustomer, password: 'WrongPassword1!' });
  await expect(page.getByText('The username and password could not be verified.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Log Out' })).not.toBeVisible();
});

test('AUTH-03: shows an error when fields are empty', async ({ page, loginPage }) => {
  await loginPage.open();
  await loginPage.submit();
  await expect(page.getByText('Please enter a username and password.')).toBeVisible();
});

test('AUTH-04: blocks account pages after logout', async ({
  page,
  loginPage,
  registeredCustomer,
}) => {
  await loginPage.open();
  await loginPage.login(registeredCustomer);
  await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
  await page.getByRole('link', { name: 'Log Out' }).click();
  await expect(loginPage.logInButton).toBeVisible();
  await page.goto('overview.htm');
  await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Accounts Overview' })).not.toBeVisible();
});
