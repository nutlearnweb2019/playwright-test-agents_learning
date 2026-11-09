import { test, expect } from '@playwright/test';

// spec: saucedemo-test-plan.md
// seed: tests/seed.spec.ts

test.describe('Sign in and authenticate', () => {
  test('Locked-out user cannot sign in', async ({ page }) => {
    // 1. Start from a fresh browser state and open https://www.saucedemo.com.
    await page.goto('https://www.saucedemo.com');
    await expect(page.getByRole('form', { name: 'Login' })).toBeVisible();

    // 2. Enter locked_out_user and secret_sauce, then select Login.
    await page.getByRole('textbox', { name: 'Username' }).fill('locked_out_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('alert')).toContainText('Sorry, this user has been locked out.');
    await expect(page.getByText('Products', { exact: true })).toHaveCount(0);
  });
});
