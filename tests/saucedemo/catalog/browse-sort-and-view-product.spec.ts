import { test, expect } from '@playwright/test';

// spec: saucedemo-test-plan.md
// seed: tests/seed.spec.ts

test.describe('Browse and inspect products', () => {
  test('Browse products, sort by price, and open a product detail', async ({ page }) => {
    // 1. Start from a fresh browser state, sign in as standard_user with secret_sauce, and open the Products page.
    await page.goto('https://www.saucedemo.com');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products', { exact: true })).toBeVisible();

    const productNames = page.locator('.inventory_item_name');
    const sortProducts = page.getByRole('combobox', { name: 'Sort products' });
    await expect(productNames).toHaveCount(6);
    await expect(sortProducts).toHaveValue('az');
    await expect(productNames.first()).toHaveText('Sauce Labs Backpack');
    await expect(productNames.last()).toHaveText('Test.allTheThings() T-Shirt (Red)');

    // 2. Select Price (low to high) from the Sort products dropdown.
    await sortProducts.selectOption('lohi');
    const productPrices = page.locator('.inventory_item_price');
    await expect(productNames.first()).toHaveText('Sauce Labs Onesie');
    await expect(productPrices.first()).toHaveText('$7.99');
    await expect(productNames.last()).toHaveText('Sauce Labs Fleece Jacket');
    await expect(productPrices.last()).toHaveText('$49.99');

    // 3. Select Price (high to low).
    await sortProducts.selectOption('hilo');
    await expect(productNames.first()).toHaveText('Sauce Labs Fleece Jacket');
    await expect(productNames.last()).toHaveText('Sauce Labs Onesie');

    // 4. Open the Sauce Labs Backpack product details.
    await page.getByRole('button', { name: 'View details for Sauce Labs Backpack' }).click();
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.getByText('$29.99', { exact: true })).toBeVisible();
    await expect(page.getByText(/carry\.allTheThings\(\).*streamlined Sly Pack/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();

    // 5. Select Back to products.
    await page.getByRole('button', { name: 'Back to products' }).click();
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });
});
