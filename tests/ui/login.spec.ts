import { USERS } from "../../pages/LoginPage";
import { expect, test } from "./fixtures";

test.describe("Login", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("standard user lands on the product list", async ({ loginPage, inventory }) => {
    await loginPage.login(USERS.standard);
    await inventory.expectLoaded();
    await expect(inventory.items).toHaveCount(6);
  });

  test("locked out user sees a clear error", async ({ loginPage, page }) => {
    await loginPage.login(USERS.lockedOut);
    await loginPage.expectError("Sorry, this user has been locked out.");
    await expect(page).not.toHaveURL(/inventory/);
  });

  const invalid = [
    { name: "empty form", user: "", password: "", error: "Username is required" },
    { name: "missing password", user: USERS.standard, password: "", error: "Password is required" },
    { name: "wrong password", user: USERS.standard, password: "nope", error: "do not match any user" },
    { name: "unknown user", user: "ghost_user", password: "secret_sauce", error: "do not match any user" },
    { name: "SQL-ish input", user: "' OR 1=1 --", password: "x", error: "do not match any user" },
  ];

  for (const c of invalid) {
    test(`rejects ${c.name}`, async ({ loginPage }) => {
      await loginPage.login(c.user, c.password);
      await loginPage.expectError(c.error);
    });
  }

  test("protected pages redirect to login when signed out", async ({ page, loginPage }) => {
    await page.goto("/inventory.html");
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in.");
  });
});
