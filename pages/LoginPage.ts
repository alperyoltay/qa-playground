import { expect, type Locator, type Page } from "@playwright/test";

export const PASSWORD = "secret_sauce"; // public demo password published on saucedemo.com

export const USERS = {
  standard: "standard_user",
  lockedOut: "locked_out_user",
  problem: "problem_user",
  error: "error_user",
} as const;

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(private page: Page) {
    this.username = page.getByPlaceholder("Username");
    this.password = page.getByPlaceholder("Password");
    this.submit = page.getByRole("button", { name: "Login" });
    this.error = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto("/");
  }

  async login(user: string, password: string = PASSWORD) {
    await this.username.fill(user);
    await this.password.fill(password);
    await this.submit.click();
  }

  async expectError(text: string | RegExp) {
    await expect(this.error).toContainText(text);
  }
}
