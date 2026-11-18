import { verify } from 'node:crypto';
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

test('BILL-02: rejects if accounts do not match', async ({
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

  await accountsOverviewPage.open();
  const balanceAfter = await accountsOverviewPage.getBalance(fromAccount);

  expect(balanceAfter).toBe(balanceBefore);
});
