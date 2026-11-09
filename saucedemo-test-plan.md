# Sauce Demo E-commerce Core User Operations Test Plan

## Application Overview

Sauce Demo (Swag Labs) is a demo storefront with a login form, six product listings, sorting, individual product details, a shopping cart, a multi-step checkout form, and an order-completion page. The plan groups coverage into five core user operations. Each test begins from a fresh browser state; tests that need an authenticated session sign in with the published standard_user / secret_sauce demo credentials. The login page itself lists the accepted demo usernames and shared password. Use independent test data and clear browser storage between cases.

## Test Scenarios

### 1. Sign in and authenticate

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successful login opens the product catalog

**File:** `tests/saucedemo/auth/successful-login.spec.ts`

**Steps:**
  1. Start from a fresh browser state and open https://www.saucedemo.com.
    - expect: The Swag Labs login form is shown with Username and Password fields and no error message.
  2. Enter standard_user as the username and secret_sauce as the password, then select Login.
    - expect: The user is authenticated and the Products inventory page opens.
    - expect: The catalog displays six products and the cart is empty.

#### 1.2. Locked-out user cannot sign in

**File:** `tests/saucedemo/auth/locked-out-login.spec.ts`

**Steps:**
  1. Start from a fresh browser state and open https://www.saucedemo.com.
    - expect: The login form is shown.
  2. Enter locked_out_user and secret_sauce, then select Login.
    - expect: The user remains on the login page.
    - expect: An error explains that this user has been locked out.
    - expect: The Products page does not open.

### 2. Browse and inspect products

**Seed:** `tests/seed.spec.ts`

#### 2.1. Browse products, sort by price, and open a product detail

**File:** `tests/saucedemo/catalog/browse-sort-and-view-product.spec.ts`

**Steps:**
  1. Start from a fresh browser state, sign in as standard_user with secret_sauce, and open the Products page.
    - expect: Six products are shown.
    - expect: The default sort is Name (A to Z), and product names are in ascending alphabetical order.
  2. Select Price (low to high) from the Sort products dropdown.
    - expect: Sauce Labs Onesie ($7.99) is first and Sauce Labs Fleece Jacket ($49.99) is last.
  3. Select Price (high to low).
    - expect: The price order reverses, with Sauce Labs Fleece Jacket first and Sauce Labs Onesie last.
  4. Open the Sauce Labs Backpack product details.
    - expect: The detail page identifies Sauce Labs Backpack, shows its description and $29.99 price, and provides Add to cart and Back to products controls.
  5. Select Back to products.
    - expect: The Products catalog is displayed again.

### 3. Manage the shopping cart

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add, review, and remove products in the cart

**File:** `tests/saucedemo/cart/add-review-remove-items.spec.ts`

**Steps:**
  1. Start from a fresh browser state and sign in as standard_user with secret_sauce.
    - expect: The Products catalog is displayed with an empty cart.
  2. Add Sauce Labs Onesie and Sauce Labs Backpack to the cart.
    - expect: Each selected product's control changes to Remove.
    - expect: The cart badge shows 2 items.
  3. Open the cart.
    - expect: The cart lists the Onesie and Backpack, each with quantity 1 and the correct product price.
    - expect: Continue Shopping and Checkout controls are available.
  4. Remove Sauce Labs Onesie from the cart.
    - expect: The Onesie row disappears, the Backpack remains, and the cart badge updates to 1 item.
  5. Select Continue Shopping.
    - expect: The Products catalog is displayed and the remaining Backpack is still reflected in the cart badge.

### 4. Enter checkout information

**Seed:** `tests/seed.spec.ts`

#### 4.1. Checkout requires each customer information field

**File:** `tests/saucedemo/checkout/required-information-validation.spec.ts`

**Steps:**
  1. Start from a fresh browser state, sign in as standard_user with secret_sauce, add one product, open the cart, and select Checkout.
    - expect: Checkout: Your Information is displayed with First Name, Last Name, and Zip/Postal Code fields.
  2. Leave all fields blank and select Continue.
    - expect: The user stays on the information step and sees an error that First Name is required.
  3. Enter Alex as First Name and select Continue without entering the other fields.
    - expect: The user stays on the information step and sees an error that Last Name is required.
  4. Enter Tester as Last Name and select Continue without entering a postal code.
    - expect: The user stays on the information step and sees an error that Zip/Postal Code is required.
  5. Enter 10001 as Zip/Postal Code and select Continue.
    - expect: The checkout proceeds to the Overview step and retains the selected product.

### 5. Review and place an order

**Seed:** `tests/seed.spec.ts`

#### 5.1. Review totals and complete a purchase

**File:** `tests/saucedemo/checkout/review-and-complete-order.spec.ts`

**Steps:**
  1. Start from a fresh browser state, sign in as standard_user with secret_sauce, add Sauce Labs Onesie, open the cart, and select Checkout.
    - expect: Checkout: Your Information is displayed.
  2. Enter Alex, Tester, and 10001 in the First Name, Last Name, and Zip/Postal Code fields, then select Continue.
    - expect: Checkout: Overview is displayed with Sauce Labs Onesie, quantity 1, and its $7.99 price.
  3. Review the payment, shipping, and price summary without selecting Finish yet.
    - expect: Payment information shows SauceCard #31337 and shipping shows Free Pony Express Delivery!.
    - expect: The item total is $7.99, tax is $0.64, and total is $8.63.
  4. Select Finish.
    - expect: Checkout: Complete! is displayed with the heading Thank you for your order! and the dispatch confirmation message.
    - expect: The cart is empty and a Back Home control is available.
  5. Select Back Home.
    - expect: The Products catalog is displayed again.
