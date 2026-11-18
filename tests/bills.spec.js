import { test, expect } from '../fixtures/fixtures.js';
import { createPayee } from '../utils/testData.js';

test('BILL-01: pays a bill and reduces the balance', async ({
  loggedInCustomer,
  billPaymentPage,
  accountsOverviewPage,
}) => {
  await accountsOverviewPage.open();
  const [fromAccount] = await accountsOverviewPage.getAccountNumbers();
  const balanceBefore = await accountsOverviewPage.getBalance(fromAccount);

  const payee = createPayee();
  const amount = 50;

  await billPaymentPage.open();
  await billPaymentPage.pay(payee, amount, fromAccount);

  await accountsOverviewPage.open();
  const balanceAfter = await accountsOverviewPage.getBalance(fromAccount);

  expect(balanceAfter).toBeCloseTo(balanceBefore - amount, 2);
});

test('BILL-02: rejects a payment when account numbers do not match', async ({
  loggedInCustomer,
  billPaymentPage,
  accountsOverviewPage,
}) => {
  await accountsOverviewPage.open();
  const [fromAccount] = await accountsOverviewPage.getAccountNumbers();
  const balanceBefore = await accountsOverviewPage.getBalance(fromAccount);

  const payee = createPayee({ verifyAccount: '123111' });
  const amount = 50;

  await billPaymentPage.open();
  await billPaymentPage.fillForm(payee, amount, fromAccount);
  await billPaymentPage.submit();

  await expect(billPaymentPage.accountMismatchError).toBeVisible();
  await expect(billPaymentPage.accountMismatchError).toHaveText(
    'The account numbers do not match.',
  );

  await accountsOverviewPage.open();
  const balanceAfter = await accountsOverviewPage.getBalance(fromAccount);

  expect(balanceAfter).toBe(balanceBefore);
});

test('BILL-03: empty form shows required field errors', async ({
  loggedInCustomer,
  billPaymentPage,
}) => {
  const expectedErrors = [
    ['name', 'Payee name is required.'],
    ['address', 'Address is required.'],
    ['city', 'City is required.'],
    ['state', 'State is required.'],
    ['zipCode', 'Zip Code is required.'],
    ['phoneNumber', 'Phone number is required.'],
    ['account-empty', 'Account number is required.'],
    ['verifyAccount-empty', 'Account number is required.'],
    ['amount-empty', 'The amount cannot be empty.'],
  ];

  await billPaymentPage.open();
  await billPaymentPage.submit();

  for (const [field, message] of expectedErrors) {
    await expect(billPaymentPage.errorFor(field)).toBeVisible();
    await expect(billPaymentPage.errorFor(field)).toHaveText(message);
  }
});

test('BILL-04: rejects a non-numeric amount', async ({
  loggedInCustomer,
  billPaymentPage,
  accountsOverviewPage,
}) => {
  await accountsOverviewPage.open();
  const [fromAccount] = await accountsOverviewPage.getAccountNumbers();
  const balanceBefore = await accountsOverviewPage.getBalance(fromAccount);
  const payee = createPayee();
  const amount = 'abc';

  await billPaymentPage.open();
  await billPaymentPage.fillForm(payee, amount, fromAccount);
  await billPaymentPage.submit();

  await expect(billPaymentPage.invalidAmountError).toBeVisible();
  await expect(billPaymentPage.invalidAmountError).toHaveText('Please enter a valid amount.');

  await accountsOverviewPage.open();
  const balanceAfter = await accountsOverviewPage.getBalance(fromAccount);

  expect(balanceAfter).toBe(balanceBefore);
});
