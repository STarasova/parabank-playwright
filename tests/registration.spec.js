import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { createCustomer } from '../utils/testData';

test('REG-01: new customer can register and is logged in', async ({ page }) => {
  
    const customer = createCustomer();
    const registerPage = new RegisterPage(page);

    await registerPage.open();
    await registerPage.register(customer);

    await expect(page.getByRole('heading', { name: `Welcome ${customer.username}`})).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toBeVisible();
});
