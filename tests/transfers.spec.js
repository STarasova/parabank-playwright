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

test('TRF-04: rejects a transfer with a non-digit amount', async ({
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
  const amount = 'abc';

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

test('TRF-05: rejects a transfer with a zero amount', async ({
  customerWithTwoAccounts,
  transferFundsPage,
  accountsOverviewPage,
}) => {
  test.fail(true, 'Known bug: ParaBank accepts a zero transfer amount');
  const { firstAccount: fromAccount, secondAccount: toAccount } = customerWithTwoAccounts;

  await accountsOverviewPage.open();
  const fromBalanceBefore = await accountsOverviewPage.getBalance(fromAccount);
  const toBalanceBefore = await accountsOverviewPage.getBalance(toAccount);
  const totalBefore = await accountsOverviewPage.getTotal();

  await transferFundsPage.open();
  const amount = 0;

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

test('TRF-08: rejects a transfer with a negative amount', async ({
  customerWithTwoAccounts,
  transferFundsPage,
  accountsOverviewPage,
}) => {
  test.fail(true, 'Known bug: ParaBank accepts a negative transfer amount');
  const { firstAccount: fromAccount, secondAccount: toAccount } = customerWithTwoAccounts;

  await accountsOverviewPage.open();
  const fromBalanceBefore = await accountsOverviewPage.getBalance(fromAccount);
  const toBalanceBefore = await accountsOverviewPage.getBalance(toAccount);
  const totalBefore = await accountsOverviewPage.getTotal();

  await transferFundsPage.open();
  const amount = -10;

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

test('TRF-06: rejects a transfer with an amount bigger than a balance', async ({
  customerWithTwoAccounts,
  transferFundsPage,
  accountsOverviewPage,
}) => {
  test.fail(true, 'Known bug: ParaBank allows a transfer bigger than the balance');
  const { firstAccount: fromAccount, secondAccount: toAccount } = customerWithTwoAccounts;

  await accountsOverviewPage.open();
  const fromBalanceBefore = await accountsOverviewPage.getBalance(fromAccount);
  const toBalanceBefore = await accountsOverviewPage.getBalance(toAccount);
  const totalBefore = await accountsOverviewPage.getTotal();

  await transferFundsPage.open();
  const amount = 10000;

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

test('TRF-07: rejects a transfer to the same account', async ({
  customerWithTwoAccounts,
  transferFundsPage,
  accountsOverviewPage,
}) => {
  test.fail(true, 'Known bug: ParaBank allows a transfer to the same account');
  const { firstAccount: account } = customerWithTwoAccounts;

  await accountsOverviewPage.open();
  const balanceBefore = await accountsOverviewPage.getBalance(account);
  const totalBefore = await accountsOverviewPage.getTotal();

  await transferFundsPage.open();
  const amount = 10;

  await transferFundsPage.fillForm(amount, account, account);
  await transferFundsPage.submit();

  await expect(transferFundsPage.errorMessage).toBeVisible();

  await accountsOverviewPage.open();
  const balanceAfter = await accountsOverviewPage.getBalance(account);
  const totalAfter = await accountsOverviewPage.getTotal();

  expect(balanceAfter).toBe(balanceBefore);
  expect(totalAfter).toBe(totalBefore);
});
