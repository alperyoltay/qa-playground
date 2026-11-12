import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      testDir: "tests/ui",
      use: { ...devices["Desktop Chrome"], baseURL: "https://www.saucedemo.com" },
    },
    {
      name: "firefox",
      testDir: "tests/ui",
      use: { ...devices["Desktop Firefox"], baseURL: "https://www.saucedemo.com" },
    },
    {
      name: "mobile",
      testDir: "tests/ui",
      testIgnore: /known-bugs/,
      use: { ...devices["Pixel 7"], baseURL: "https://www.saucedemo.com" },
    },
    {
      name: "api",
      testDir: "tests/api",
      use: { baseURL: "https://restful-booker.herokuapp.com" },
    },
  ],
});
