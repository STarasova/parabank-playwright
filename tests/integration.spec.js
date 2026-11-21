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
