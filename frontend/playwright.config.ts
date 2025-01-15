// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */

// Environment configurations
const environments = {
  local: "http://localhost:3000",
  prod: "https://activist.org",
};

// Determine the environment from the command line or default to 'local'.
const ENV = (process.env.TEST_ENV || "local") as keyof typeof environments;

export default defineConfig({
  testDir: "./test-e2e/specs",
  /* Run tests in files in parallel. */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only. */
  retries: process.env.CI ? 4 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters. */
  reporter: [
    ["html", { open: "never", outputDir: "test-results" }],
    ["list"],
    [
      "./test-e2e/utils/axe-reporter.ts",
      { outputDir: "test-results/accessibility-results" },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: environments[ENV],

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer. */
    trace: "on-first-retry",
    screenshot: {
      mode: "only-on-failure",
      fullPage: true,
    },
  },

  /* Configure projects for major desktop browsers. */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"], isMobile: true },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"], isMobile: true },
    },
    {
      name: "Mobile Samsung",
      use: { ...devices["Galaxy S9+"], isMobile: true },
    },
    {
      name: "Mobile iPad Portrait",
      use: { ...devices["iPad (gen 7)"], isMobile: true },
    },
    {
      name: "Mobile iPad Landscape",
      use: { ...devices["iPad (gen 7 landscape)"], isMobile: true },
    },
  ],

  /* Run your local dev server before starting the tests. */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
