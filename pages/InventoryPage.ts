import { expect, type Locator, type Page } from "@playwright/test";

export type SortOption = "az" | "za" | "lohi" | "hilo";

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly sort: Locator;

  constructor(private page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sort = page.locator('[data-test="product-sort-container"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText("Products");
  }

  item(name: string) {
    return this.items.filter({ hasText: name });
  }

  async addToCart(name: string) {
    await this.item(name).getByRole("button", { name: "Add to cart" }).click();
  }

  async removeFromCart(name: string) {
    await this.item(name).getByRole("button", { name: "Remove" }).click();
  }

  async sortBy(option: SortOption) {
    await this.sort.selectOption(option);
  }

  async names() {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async prices() {
    const texts = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return texts.map((t) => Number(t.replace("$", "")));
  }

  async imageSources() {
    return this.page.locator(".inventory_item_img img").evaluateAll((imgs) =>
      imgs.map((img) => (img as HTMLImageElement).getAttribute("src") ?? ""),
    );
  }

  async openCart() {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }
}
