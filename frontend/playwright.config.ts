// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineConfig, devices } from "@playwright/test";
import path from "path";

export const RESULTS_PATH = path.join(__dirname, "./test-results");

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// Environment configurations.
const environments = {
  local: "http://localhost:3000",
  prod: "https://activist.org",
};

// Device Type matching for describe blocks.
const matchMobile = /@mobile/;
const matchDesktop = /@desktop/;

// Determine the environment from the command line or default to 'local'.
const ENV = (process.env.TEST_ENV || "local") as keyof typeof environments;

export default defineConfig({
  testDir: "./test-e2e/specs",
  /* Run tests in files in parallel. */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on both CI and local - helps with flaky tests. */
  retries: 4,
  /* Enhanced parallel execution with test sharding. */
  workers: process.env.CI ? 4 : 2,
  /* Fail on flaky tests to ensure stability. */
  failOnFlakyTests: !!process.env.CI,
  /* User data directory for browser state persistence */
  // userDataDir: process.env.CI ? undefined : "./test-results/user-data",
  /* Reporter to use. See https://playwright.dev/docs/test-reporters. */
  reporter: [
    [
      "html",
      {
        open: "never",
        outputDir: "test-results",
        title: `Activist E2E Tests - ${new Date().toISOString().split("T")[0]}`,
      },
    ],
    [
      "junit",
      {
        outputFile: "test-results/junit-results.xml",
        includeProjectInTestName: true,
        embedAnnotationsAsProperty: true,
      },
    ],
    ["list"],
    ["./test-e2e/reporters/execution-time-reporter.ts"],
    [
      "./test-e2e/accessibility/axe-reporter.ts",
      { outputDirPath: RESULTS_PATH },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: environments[ENV],
    navigationTimeout: 10000,

    /* Enhanced trace configuration for better debugging. */
    trace: {
      mode: "on-first-retry",
      snapshots: true,
      sources: true,
      screenshots: true,
    },
    screenshot: {
      mode: "only-on-failure",
      fullPage: true,
    },
  },

  /* Configure projects for major desktop browsers. */
  projects: [
    // Core browsers - always run
    {
      name: "chromium",
      grep: matchDesktop,
      // Dedicated workers for desktop tests.
      workers: process.env.CI ? 2 : 1,
      use: {
        ...devices["Desktop Chrome"],
        // Reuse browser state for faster authentication.
        // userDataDir: process.env.CI
        //   ? undefined
        //   : "./test-results/user-data/chromium",
      },
    },
    {
      name: "Mobile Chrome",
      grep: matchMobile,
      // More workers for mobile tests.
      workers: process.env.CI ? 2 : 1,
      use: {
        ...devices["Pixel 5"],
        isMobile: true,
        hasTouch: true,
        // Reuse browser state for faster authentication.
        // userDataDir: process.env.CI
        //   ? undefined
        //   : "./test-results/user-data/mobile-chrome",
      },
    },

    // Additional browsers - only run in comprehensive mode
    ...(process.env.FAST_TESTS
      ? []
      : [
          {
            name: "webkit",
            grep: matchDesktop,
            workers: process.env.CI ? 1 : 1,
            use: {
              ...devices["Desktop Safari"],
              // WebKit performance optimizations
              launchOptions: {
                args: [
                  "--disable-web-security",
                  "--disable-features=VizDisplayCompositor",
                  "--disable-background-timer-throttling",
                  "--disable-backgrounding-occluded-windows",
                  "--disable-renderer-backgrounding",
                ],
              },
              // Reuse browser state for faster authentication.
              // userDataDir: process.env.CI
              //   ? undefined
              //   : "./test-results/user-data/webkit",
            },
          },
          {
            name: "iPad Landscape",
            grep: matchDesktop,
            workers: process.env.CI ? 1 : 1,
            use: {
              ...devices["iPad (gen 7 landscape)"],
              isMobile: true,
              hasTouch: true,
              // Reuse browser state for faster authentication.
              // userDataDir: process.env.CI
              //   ? undefined
              //   : "./test-results/user-data/ipad-landscape",
            },
          },
          {
            name: "iPad Portrait",
            grep: matchDesktop,
            workers: process.env.CI ? 1 : 1,
            use: {
              ...devices["iPad (gen 7)"],
              isMobile: true,
              hasTouch: true,
              // Reuse browser state for faster authentication.
              // userDataDir: process.env.CI
              //   ? undefined
              //   : "./test-results/user-data/ipad-portrait",
            },
          },
          {
            name: "Mobile Safari",
            grep: matchMobile,
            workers: process.env.CI ? 1 : 1,
            use: {
              ...devices["iPhone 12"],
              isMobile: true,
              hasTouch: true,
              // Reuse browser state for faster authentication.
              // userDataDir: process.env.CI
              //   ? undefined
              //   : "./test-results/user-data/mobile-safari",
            },
          },
          {
            name: "Mobile Samsung",
            grep: matchMobile,
            workers: process.env.CI ? 1 : 1,
            use: {
              ...devices["Galaxy S9+"],
              isMobile: true,
              hasTouch: true,
              // Reuse browser state for faster authentication.
              // userDataDir: process.env.CI
              //   ? undefined
              //   : "./test-results/user-data/mobile-samsung",
            },
          },
        ]),
  ],

  /* Run your local dev server before starting the tests. */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
