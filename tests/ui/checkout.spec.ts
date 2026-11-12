import { expect, test } from "./fixtures";

test.describe("Checkout", () => {
  test.beforeEach(async ({ loggedIn, checkout }) => {
    await loggedIn.addToCart("Sauce Labs Backpack");
    await loggedIn.addToCart("Sauce Labs Fleece Jacket");
    await loggedIn.openCart();
    await checkout.startFromCart();
  });

  test("happy path: order completes and totals add up", async ({ checkout, page }) => {
    await checkout.fillInfo("Alper", "Tester", "22030");
    await expect(page).toHaveURL(/checkout-step-two/);

    const [itemTotal, tax, total] = [await checkout.itemTotal(), await checkout.tax(), await checkout.total()];
    expect(itemTotal).toBeCloseTo(29.99 + 49.99, 2);
    expect(total).toBeCloseTo(itemTotal + tax, 2);
    expect(tax / itemTotal).toBeCloseTo(0.08, 2);

    await checkout.finish();
    await checkout.expectComplete();
  });

  const missing = [
    { first: "", last: "Tester", zip: "22030", error: "First Name is required" },
    { first: "Alper", last: "", zip: "22030", error: "Last Name is required" },
    { first: "Alper", last: "Tester", zip: "", error: "Postal Code is required" },
  ];

  for (const c of missing) {
    test(`blocks checkout: ${c.error}`, async ({ checkout }) => {
      await checkout.fillInfo(c.first, c.last, c.zip);
      await expect(checkout.error).toContainText(c.error);
    });
  }
});
