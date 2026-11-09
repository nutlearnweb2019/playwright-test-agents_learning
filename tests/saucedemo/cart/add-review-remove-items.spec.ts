import { test, expect } from '@playwright/test';

// spec: saucedemo-test-plan.md
// seed: tests/seed.spec.ts

test.describe('Manage the shopping cart', () => {
  test('Add, review, and remove products in the cart', async ({ page }) => {
    // 1. Start from a fresh browser state and sign in as standard_user with secret_sauce.
    await page.goto('https://www.saucedemo.com');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();

    // 2. Add Sauce Labs Onesie and Sauce Labs Backpack to the cart.
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="remove-sauce-labs-onesie"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, 2 items' })).toBeVisible();

    // 3. Open the cart.
    await page.getByRole('button', { name: 'Cart, 2 items' }).click();
    const cartItems = page.locator('.cart_item');
    const onesie = cartItems.filter({ hasText: 'Sauce Labs Onesie' });
    const backpack = cartItems.filter({ hasText: 'Sauce Labs Backpack' });
    await expect(cartItems).toHaveCount(2);
    await expect(onesie).toContainText('1');
    await expect(onesie).toContainText('$7.99');
    await expect(backpack).toContainText('1');
    await expect(backpack).toContainText('$29.99');
    await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();

    // 4. Remove Sauce Labs Onesie from the cart.
    await page.locator('[data-test="remove-sauce-labs-onesie"]').click();
    await expect(cartItems).toHaveCount(1);
    await expect(onesie).toHaveCount(0);
    await expect(backpack).toBeVisible();
    await expect(backpack).toContainText('$29.99');
    await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();

    // 5. Select Continue Shopping.
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();
  });
});
