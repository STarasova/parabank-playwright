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

test('INT-03: transfer via API is shown in the UI', async ({
  customerWithTwoAccounts,
  api,
  accountDetailsPage,
}) => {
  const { firstAccount, secondAccount } = customerWithTwoAccounts;

  const amount = 12.34;

  await api.transfer(firstAccount, secondAccount, amount);

  await accountDetailsPage.open(firstAccount);
  const sent = await accountDetailsPage.getTransaction(amount);

  expect(sent.debit).toBe(amount);
  expect(sent.credit).toBe(0);

  await accountDetailsPage.open(secondAccount);
  const received = await accountDetailsPage.getTransaction(amount);

  expect(received.credit).toBe(amount);
  expect(received.debit).toBe(0);
});

test('INT-04: account balances in the UI match the API', async ({
  customerWithTwoAccounts,
  api,
  accountsOverviewPage,
}) => {
  const username = customerWithTwoAccounts.customer.username;
  const password = customerWithTwoAccounts.customer.password;

  const customerId = (await api.login(username, password)).id;

  const accountsFromAPI = await api.getAccounts(customerId);

  await accountsOverviewPage.open();

  const accountNumbersFromUI = await accountsOverviewPage.getAccountNumbers();

  expect(accountNumbersFromUI).toHaveLength(accountsFromAPI.length);

  for (const account of accountsFromAPI) {
    const balanceInUI = await accountsOverviewPage.getBalance(String(account.id));
    expect(balanceInUI).toBeCloseTo(account.balance, 2);
  }
});
