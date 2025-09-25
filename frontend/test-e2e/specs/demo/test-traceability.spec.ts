// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.describe("Demo: Enhanced Test Traceability", { tag: ["@desktop"] }, () => {
  test.describe("Feature A", () => {
    test("should demonstrate testInfo.titlePath", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      // This will output: "Demo: Enhanced Test Traceability > Feature A > should demonstrate testInfo.titlePath > test-traceability.spec.ts"

      await withTestStep(testInfo, "Navigate to a page", async () => {
        await page.goto("https://example.com");
        await expect(page).toHaveTitle(/Example Domain/);
      });

      await withTestStep(testInfo, "Verify page content", async () => {
        const heading = page.getByRole("heading", { name: "Example Domain" });
        await expect(heading).toBeVisible();
      });
    });

    test("should show nested test steps", async ({ page }, testInfo) => {
      logTestPath(testInfo);

      await withTestStep(testInfo, "Setup test environment", async () => {
        await page.goto("https://example.com");

        await withTestStep(testInfo, "Verify initial state", async () => {
          await expect(page).toHaveTitle(/Example Domain/);
        });
      });

      await withTestStep(testInfo, "Perform main action", async () => {
        const heading = page.getByRole("heading", { name: "Example Domain" });
        await expect(heading).toBeVisible();
      });
    });
  });

  test.describe("Feature B", () => {
    test("should handle test failures with context", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      try {
        await withTestStep(
          testInfo,
          "Navigate to non-existent page",
          async () => {
            await page.goto("https://this-page-does-not-exist-12345.com");
          }
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`❌ Test failed: ${testInfo.titlePath.join(" > ")}`);
        // eslint-disable-next-line no-console
        console.error(`   Error: ${error.message}`);
        throw error;
      }
    });
  });
});
