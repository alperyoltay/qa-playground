/**
 * saucedemo ships deliberately broken accounts. These tests describe the
 * CORRECT behaviour and are marked `test.fail()`, so the suite stays green
 * while the bugs exist and turns red the day one of them gets fixed.
 * Each bug is written up in BUGS.md.
 */
import { CheckoutPage } from "../../pages/CheckoutPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { LoginPage, USERS } from "../../pages/LoginPage";
import { expect, test } from "./fixtures";

async function loginAs(page: import("@playwright/test").Page, user: string) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(user);
  const inventory = new InventoryPage(page);
  await inventory.expectLoaded();
  return inventory;
}

test.describe("Known bugs (problem_user / error_user)", () => {
  test("BUG-001: problem_user sees the same image for every product", async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.problem);
    const srcs = await inventory.imageSources();
    expect(new Set(srcs).size).toBe(srcs.length);
  });

  test("BUG-002: problem_user cannot sort by price", async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.problem);
    await inventory.sortBy("lohi");
    const prices = await inventory.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("BUG-003: problem_user's last name field overwrites first name", async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.problem);
    await inventory.addToCart("Sauce Labs Backpack");
    await inventory.openCart();
    const checkout = new CheckoutPage(page);
    await checkout.startFromCart();
    await checkout.firstName.fill("Alper");
    await checkout.lastName.fill("Tester");
    await expect(checkout.lastName).toHaveValue("Tester");
  });

  test("BUG-004: error_user cannot finish an order", async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.error);
    await inventory.addToCart("Sauce Labs Backpack");
    await inventory.openCart();
    const checkout = new CheckoutPage(page);
    await checkout.startFromCart();
    await checkout.fillInfo("Alper", "Tester", "22030");
    await checkout.finish();
    await checkout.expectComplete();
  });
});
