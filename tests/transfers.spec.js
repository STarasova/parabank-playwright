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
