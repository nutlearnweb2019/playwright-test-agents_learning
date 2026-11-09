import { test, expect } from '@playwright/test';

// spec: saucedemo-test-plan.md
// seed: tests/seed.spec.ts

test.describe('Enter checkout information', () => {
  test('Checkout requires each customer information field', async ({ page }) => {
    // 1. Start from a fresh browser state, sign in as standard_user with secret_sauce, add one product, open the cart, and select Checkout.
    await page.goto('https://www.saucedemo.com');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    const firstName = page.getByRole('textbox', { name: 'First Name' });
    const lastName = page.getByRole('textbox', { name: 'Last Name' });
    const postalCode = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    const continueButton = page.getByRole('button', { name: 'Continue' });
    await expect(page.getByText('Checkout: Your Information', { exact: true })).toBeVisible();
    await expect(firstName).toBeVisible();
    await expect(lastName).toBeVisible();
    await expect(postalCode).toBeVisible();

    // 2. Leave all fields blank and select Continue.
    await continueButton.click();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await expect(page.getByRole('alert')).toContainText('First Name is required');

    // 3. Enter Alex as First Name and select Continue without entering the other fields.
    await firstName.fill('Alex');
    await continueButton.click();
    await expect(page.getByRole('alert')).toContainText('Last Name is required');

    // 4. Enter Tester as Last Name and select Continue without entering a postal code.
    await lastName.fill('Tester');
    await continueButton.click();
    await expect(page.getByRole('alert')).toContainText('Postal Code is required');

    // 5. Enter 10001 as Zip/Postal Code and select Continue.
    await postalCode.fill('10001');
    await continueButton.click();
    await expect(page).toHaveURL(/checkout-step-two\.html$/);
    await expect(page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
    await expect(page.locator('.cart_item')).toContainText('Sauce Labs Onesie');
  });
});
