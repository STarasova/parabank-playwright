import { test, expect } from '../fixtures/fixtures.js';

test('ACC-01: new customer has an account', async ({ accountsOverviewPage, loggedInCustomer }) => {
  await accountsOverviewPage.open();

  const accountNumbers = await accountsOverviewPage.getAccountNumbers();

  expect(accountNumbers).toHaveLength(1);

  const totalBalance = await accountsOverviewPage.getTotal();
  const balance = await accountsOverviewPage.getBalance(accountNumbers);

  expect(totalBalance).toBeGreaterThan(0);
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
