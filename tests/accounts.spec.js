import { test, expect } from '../fixtures/fixtures.js';

test('ACC-01:new customer has an account', async ({ accountsOverviewPage, loggedInCustomer }) => {
  await accountsOverviewPage.open();
  const accountNumbers = await accountsOverviewPage.getAccountNumbers();

  expect(accountNumbers).toHaveLength(1);
});
