import { test, expect } from '../fixtures/fixtures.js';

test('INT-01: account opened via API is shown in the UI', async ({
  loggedInCustomer,
  api,
  accountsOverviewPage,
}) => {
  const customerFromApi = await api.login(loggedInCustomer.username, loggedInCustomer.password);
  const accounts = await api.getAccounts(customerFromApi.id);
  const fromAccountId = accounts[0].id;

  const newAccount = await api.createAccount(customerFromApi.id, fromAccountId);

  await accountsOverviewPage.open();
  const accountNumbers = await accountsOverviewPage.getAccountNumbers();

  expect(accountNumbers).toContain(String(newAccount.id));
});

test('INT-02: transfer via UI is shown in the API', async ({
  customerWithTwoAccounts,
  api,
  transferFundsPage,
}) => {
  const { firstAccount, secondAccount } = customerWithTwoAccounts;

  const fromBalanceBefore = (await api.getAccount(firstAccount)).balance;
  const toBalanceBefore = (await api.getAccount(secondAccount)).balance;

  const amount = 12.34;
  await transferFundsPage.open();
  await transferFundsPage.transfer(amount, firstAccount, secondAccount);

  const fromBalanceAfter = (await api.getAccount(firstAccount)).balance;
  const toBalanceAfter = (await api.getAccount(secondAccount)).balance;

  expect(fromBalanceAfter).toBeCloseTo(fromBalanceBefore - amount, 2);
  expect(toBalanceAfter).toBeCloseTo(toBalanceBefore + amount, 2);
});
