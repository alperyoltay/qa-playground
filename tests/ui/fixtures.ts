import { test as base } from "@playwright/test";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { LoginPage, USERS } from "../../pages/LoginPage";

type Pages = {
  loginPage: LoginPage;
  inventory: InventoryPage;
  checkout: CheckoutPage;
  /** Inventory page already logged in as standard_user. */
  loggedIn: InventoryPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventory: async ({ page }, use) => use(new InventoryPage(page)),
  checkout: async ({ page }, use) => use(new CheckoutPage(page)),
  loggedIn: async ({ page, loginPage, inventory }, use) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard);
    await inventory.expectLoaded();
    await use(inventory);
  },
});

export { expect } from "@playwright/test";
