import { test, expect } from '../fixtures/fixtures.js';

test('ACC-01: new customer has an account', async ({ accountsOverviewPage, loggedInCustomer }) => {
  await accountsOverviewPage.open();

  const accountNumbers = await accountsOverviewPage.getAccountNumbers();
  const balance = await accountsOverviewPage.getBalance(accountNumbers[0]);
  const totalBalance = await accountsOverviewPage.getTotal();

  expect(accountNumbers).toHaveLength(1);
  expect(balance).toBeGreaterThan(0);
  expect(totalBalance).toBe(balance);
});

test('ACC-02: customer can open new checking account', async ({
  openAccountPage,
  accountsOverviewPage,
  loggedInCustomer,
}) => {
  await openAccountPage.open();
  await openAccountPage.openNewAccount('CHECKING');
  const newAccountNumber = await openAccountPage.getNewAccountNumber();

  await accountsOverviewPage.open();
  const accountNumbers = await accountsOverviewPage.getAccountNumbers();

  expect(accountNumbers).toHaveLength(2);
  expect(accountNumbers).toContain(newAccountNumber);
});

test('ACC-03: customer can open new saving account', async ({
  openAccountPage,
  accountDetailsPage,
  loggedInCustomer,
}) => {
  await openAccountPage.open();
  await openAccountPage.openNewAccount('SAVINGS');
  const newAccountNumber = await openAccountPage.getNewAccountNumber();

  await accountDetailsPage.open(newAccountNumber);
  await expect(accountDetailsPage.accountType).toHaveText('SAVINGS');
});

test('ACC-04: correct total balance when opens new account', async ({
  loggedInCustomer,
  accountsOverviewPage,
  openAccountPage,
}) => {
  await accountsOverviewPage.open();
  const [initialAccount] = await accountsOverviewPage.getAccountNumbers();
  const initialBalanceBefore = await accountsOverviewPage.getBalance(initialAccount);
  const totalBefore = await accountsOverviewPage.getTotal();

  await openAccountPage.open();
  await openAccountPage.openNewAccount('SAVINGS');
  const newAccount = await openAccountPage.getNewAccountNumber();

  await accountsOverviewPage.open();
  const initialBalanceAfter = await accountsOverviewPage.getBalance(initialAccount);
  const newBalance = await accountsOverviewPage.getBalance(newAccount);
  const totalAfter = await accountsOverviewPage.getTotal();

  expect(newBalance).toBeGreaterThan(0);
  expect(initialBalanceAfter).toBeCloseTo(initialBalanceBefore - newBalance, 2);
  expect(totalAfter).toBeCloseTo(totalBefore, 2);
});
