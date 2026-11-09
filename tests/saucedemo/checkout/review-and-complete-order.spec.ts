import { test, expect } from '@playwright/test';

// spec: saucedemo-test-plan.md
// seed: tests/seed.spec.ts

test.describe('Review and place an order', () => {
  test('Review totals and complete a purchase', async ({ page }) => {
    // 1. Start from a fresh browser state, sign in as standard_user with secret_sauce, add Sauce Labs Onesie, open the cart, and select Checkout.
    await page.goto('https://www.saucedemo.com');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page.getByText('Checkout: Your Information', { exact: true })).toBeVisible();

    // 2. Enter Alex, Tester, and 10001 in the First Name, Last Name, and Zip/Postal Code fields, then select Continue.
    await page.getByRole('textbox', { name: 'First Name' }).fill('Alex');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Tester');
    await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('10001');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL(/checkout-step-two\.html$/);
    await expect(page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
    const orderItem = page.locator('.cart_item');
    await expect(orderItem).toHaveCount(1);
    await expect(orderItem).toContainText('Sauce Labs Onesie');
    await expect(page.locator('.cart_quantity')).toHaveText('1');
    await expect(orderItem).toContainText('$7.99');

    // 3. Review the payment, shipping, and price summary without selecting Finish yet.
    await expect(page.getByText('SauceCard #31337', { exact: true })).toBeVisible();
    await expect(page.getByText('Free Pony Express Delivery!', { exact: true })).toBeVisible();
    await expect(page.getByText('Item total: $7.99', { exact: true })).toBeVisible();
    await expect(page.getByText('Tax: $0.64', { exact: true })).toBeVisible();
    await expect(page.getByText('Total: $8.63', { exact: true })).toBeVisible();

    // 4. Select Finish.
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByText('Checkout: Complete!', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
    await expect(page.getByText('Your order has been dispatched, and will arrive just as fast as the pony can get there!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back Home' })).toBeVisible();

    // 5. Select Back Home.
    await page.getByRole('button', { name: 'Back Home' }).click();
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });
});
