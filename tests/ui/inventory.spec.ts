import { expect, test } from "./fixtures";

test.describe("Inventory", () => {
  test("sorts by name A→Z and Z→A", async ({ loggedIn }) => {
    await loggedIn.sortBy("za");
    const za = await loggedIn.names();
    expect(za).toEqual([...za].sort().reverse());

    await loggedIn.sortBy("az");
    const az = await loggedIn.names();
    expect(az).toEqual([...az].sort());
  });

  test("sorts by price low→high and high→low", async ({ loggedIn }) => {
    await loggedIn.sortBy("lohi");
    const lohi = await loggedIn.prices();
    expect(lohi).toEqual([...lohi].sort((a, b) => a - b));

    await loggedIn.sortBy("hilo");
    const hilo = await loggedIn.prices();
    expect(hilo).toEqual([...hilo].sort((a, b) => b - a));
  });

  test("every product has its own image", async ({ loggedIn }) => {
    const srcs = await loggedIn.imageSources();
    expect(new Set(srcs).size).toBe(srcs.length);
  });

  test("cart badge follows add and remove", async ({ loggedIn }) => {
    await expect(loggedIn.cartBadge).toBeHidden();
    await loggedIn.addToCart("Sauce Labs Backpack");
    await loggedIn.addToCart("Sauce Labs Bike Light");
    await expect(loggedIn.cartBadge).toHaveText("2");
    await loggedIn.removeFromCart("Sauce Labs Backpack");
    await expect(loggedIn.cartBadge).toHaveText("1");
  });

  test("cart survives a page reload", async ({ loggedIn, page }) => {
    await loggedIn.addToCart("Sauce Labs Onesie");
    await page.reload();
    await expect(loggedIn.cartBadge).toHaveText("1");
  });
});
