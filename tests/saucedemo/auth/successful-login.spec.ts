import { test, expect } from '@playwright/test';

// spec: saucedemo-test-plan.md
// seed: tests/seed.spec.ts

test.describe('Sign in and authenticate', () => {
  test('Successful login opens the product catalog', async ({ page }) => {
    // 1. Start from a fresh browser state and open https://www.saucedemo.com.
    await page.goto('https://www.saucedemo.com');
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);

    // 2. Enter standard_user as the username and secret_sauce as the password, then select Login.
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
  });
});
