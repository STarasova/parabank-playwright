import { test, expect } from '../fixtures/fixtures.js';
import { createCustomer } from '../utils/testData.js';

test('REG-01: new customer can register and is logged in', async ({ page, registerPage }) => {
  const customer = createCustomer();
  await registerPage.open();
  await registerPage.register(customer);

  await expect(page.getByRole('heading', { name: `Welcome ${customer.username}` })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Log Out' })).toBeVisible();
});

test('REG-02: empty form shows required field errors', async ({ page, registerPage }) => {
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

test('REG-03: rejects if password and confirm password do not match', async ({
  page,
  registerPage,
}) => {
  const customer = createCustomer({ confirmPassword: 'Mismatch' });

  await registerPage.open();
  await registerPage.register(customer);

  await expect(registerPage.confirmPasswordError).toHaveText('Passwords did not match.');
  await expect(page.getByRole('link', { name: 'Log Out' })).not.toBeVisible();
});

test('REG-04: rejects an already taken username ', async ({
  page,
  registerPage,
  registedCustomer,
}) => {
  const newCustomer = createCustomer({ username: existingCustomer.username });

  await registerPage.open();
  await registerPage.register(registedCustomer);

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
