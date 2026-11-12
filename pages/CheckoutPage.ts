import { expect, type Locator, type Page } from "@playwright/test";

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly error: Locator;

  constructor(private page: Page) {
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.error = page.locator('[data-test="error"]');
  }

  async startFromCart() {
    await this.page.locator('[data-test="checkout"]').click();
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async fillInfo(first: string, last: string, zip: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);
    await this.page.locator('[data-test="continue"]').click();
  }

  async itemTotal() {
    const text = await this.page.locator('[data-test="subtotal-label"]').textContent();
    return Number(text?.replace(/[^\d.]/g, ""));
  }

  async tax() {
    const text = await this.page.locator('[data-test="tax-label"]').textContent();
    return Number(text?.replace(/[^\d.]/g, ""));
  }

  async total() {
    const text = await this.page.locator('[data-test="total-label"]').textContent();
    return Number(text?.replace(/[^\d.]/g, ""));
  }

  async finish() {
    await this.page.locator('[data-test="finish"]').click();
  }

  async expectComplete() {
    await expect(this.page.locator('[data-test="complete-header"]')).toHaveText("Thank you for your order!");
  }
}
