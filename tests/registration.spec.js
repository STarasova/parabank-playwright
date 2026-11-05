import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { createCustomer } from '../utils/testData';

test('REG-01: new customer can register and is logged in', async ({ page }) => {
  const customer = createCustomer();
  const registerPage = new RegisterPage(page);

  await registerPage.open();
  await registerPage.register(customer);

  await expect(page.getByRole('heading', { name: `Welcome ${customer.username}` })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Log Out' })).toBeVisible();
});

test('REG-02: empty form shows required field errors', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  await registerPage.open();
  await registerPage.submit();

  const expectedErrors = [
    ['customer.firstName', 'First name is required.'],
    ['customer.lastName', 'Last name is required.'],
    ['customer.address.street', 'Address is required.'],
    ['customer.address.city', 'City is required.'],
    ['customer.address.state', 'State is required.'],
    ['customer.address.zipCode', 'Zip Code is required.'],
    ['customer.ssn', 'Social Security Number is required.'],
    ['customer.username', 'Username is required.'],
    ['customer.password', 'Password is required.'],
    ['repeatedPassword', 'Password confirmation is required.'],
  ];

  for (const [field, message] of expectedErrors) {
    await expect(registerPage.errorFor(field)).toHaveText(message);
  }

  await expect(page.getByRole('link', { name: 'Log Out' })).not.toBeVisible();
});

test('REG-03: password and confirm password do not match', async ({ page }) => {
  const customer = createCustomer({ confirmPassword: 'Mismatch' });
  const registerPage = new RegisterPage(page);

  await registerPage.open();
  await registerPage.register(customer);

  await expect(registerPage.confirmPasswordError).toHaveText('Passwords did not match.');
  await expect(page.getByRole('link', { name: 'Log Out' })).not.toBeVisible();
});

test('REG-04: username is taken ', async ({ page }) => {
  const existingCustomer = createCustomer();
  const newCustomer = createCustomer({ username: existingCustomer.username });
  const registerPage = new RegisterPage(page);

  await registerPage.open();
  await registerPage.register(existingCustomer);

  await expect(
    page.getByRole('heading', { name: `Welcome ${existingCustomer.username}` }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Log Out' }).click();

  await registerPage.open();

  await registerPage.register(newCustomer);

  await expect(registerPage.errorFor('customer.username')).toHaveText(
    'This username already exists.',
  );
  await expect(page.getByRole('link', { name: 'Log Out' })).not.toBeVisible();
});
