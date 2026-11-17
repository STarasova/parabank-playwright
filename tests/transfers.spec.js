import { test, expect } from '../fixtures/fixtures.js';

test('TRF-01: transfer moves money between accounts', async ({
  customerWithTwoAccounts,
  transferFundsPage,
  accountsOverviewPage,
}) => {
  const { firstAccount, secondAccount } = customerWithTwoAccounts;

  await accountsOverviewPage.open();
  const fromBalanceBefore = await accountsOverviewPage.getBalance(firstAccount);
  const toBalanceBefore = await accountsOverviewPage.getBalance(secondAccount);
  const totalBefore = await accountsOverviewPage.getTotal();

  await transferFundsPage.open();
  const amount = 50;
  await transferFundsPage.transfer(amount, firstAccount, secondAccount);

  await accountsOverviewPage.open();
  const fromBalanceAfter = await accountsOverviewPage.getBalance(firstAccount);
  const toBalanceAfter = await accountsOverviewPage.getBalance(secondAccount);
  const totalAfter = await accountsOverviewPage.getTotal();

  expect(fromBalanceAfter).toBeCloseTo(fromBalanceBefore - amount, 2);
  expect(toBalanceAfter).toBeCloseTo(toBalanceBefore + amount, 2);
  expect(totalAfter).toBe(totalBefore, 2);
});

test('TRF-02: transfer is shown in the history of accounts', async ({
  customerWithTwoAccounts,
  transferFundsPage,
  accountDetailsPage,
  accountsOverviewPage,
}) => {
  const { firstAccount: fromAccount, secondAccount: toAccount } = customerWithTwoAccounts;

  await transferFundsPage.open();
  const amount = 12.34;
  await transferFundsPage.transfer(amount, fromAccount, toAccount);

  await accountDetailsPage.open(fromAccount);
  const sent = await accountDetailsPage.getTransaction(amount);

  expect(sent.debit).toBe(amount);
  expect(sent.credit).toBe(0);

  await accountDetailsPage.open(toAccount);
  const received = await accountDetailsPage.getTransaction(amount);

  expect(received.credit).toBe(amount);
  expect(received.debit).toBe(0);
});

test('TRF-03: rejects a transfer with an empty amount', async ({
  customerWithTwoAccounts,
  transferFundsPage,
  accountsOverviewPage,
}) => {
  const { firstAccount: fromAccount, secondAccount: toAccount } = customerWithTwoAccounts;

  await accountsOverviewPage.open();
  const fromBalanceBefore = await accountsOverviewPage.getBalance(fromAccount);
  const toBalanceBefore = await accountsOverviewPage.getBalance(toAccount);
  const totalBefore = await accountsOverviewPage.getTotal();

  await transferFundsPage.open();
  const amount = '';

  await transferFundsPage.fillForm(amount, fromAccount, toAccount);
  await transferFundsPage.submit();

  await expect(transferFundsPage.errorMessage).toBeVisible();

  await accountsOverviewPage.open();
  const fromBalanceAfter = await accountsOverviewPage.getBalance(fromAccount);
  const toBalanceAfter = await accountsOverviewPage.getBalance(toAccount);
  const totalAfter = await accountsOverviewPage.getTotal();

  expect(fromBalanceAfter).toBe(fromBalanceBefore);
  expect(toBalanceAfter).toBe(toBalanceBefore);
  expect(totalAfter).toBe(totalBefore);
});
