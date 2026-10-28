import { test, expect } from '@playwright/test';

test('REG-01: new customer can register and is logged in', async ({ page }) => {
    const username = `user_${Date.now()}`;
    const password = 'Test123!';

    await page.goto('register.htm');
    await page.locator('[id="customer.firstName"]').fill('Anna');
    await page.locator('[id="customer.lastName"]').fill('Tester');
    await page.locator('[id="customer.address.street"]').fill('Main Street 1');
    await page.locator('[id="customer.address.city"]').fill('Berlin');
    await page.locator('[id="customer.address.state"]').fill('Berlin');
    await page.locator('[id="customer.address.zipCode"]').fill('10115');
    await page.locator('[id="customer.phoneNumber"]').fill('123456789');
    await page.locator('[id="customer.ssn"]').fill('123-45-6789');
    await page.locator('[id="customer.username"]').fill(username);
    await page.locator('[id="customer.password"]').fill(password);
    await page.locator('#repeatedPassword').fill(password);

    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByRole('heading', { name: `Welcome ${username}` })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toBeVisible();
});
