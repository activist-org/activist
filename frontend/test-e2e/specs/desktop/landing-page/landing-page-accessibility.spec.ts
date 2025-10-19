// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";
import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    new RegExp(getEnglishText("i18n.components.landing_splash.header"), "i")
  );
});

test.describe(
  "Landing Page - Accessibility",
  { tag: ["@desktop", "@unauth"] },
  () => {
    // Override to run without authentication (landing page for unauthenticated users).
    test.use({ storageState: undefined });

    // Explicitly clear all cookies to ensure unauthenticated state.
    test.beforeEach(async ({ context }) => {
      await context.clearCookies();
    });

    // MARK: Accessibility

    // Note: Check to make sure that this is eventually done for light and dark modes.
    test(
      "Landing Page has no detectable accessibility issues",
      { tag: "@accessibility" },
      async ({ page }, testInfo) => {
        logTestPath(testInfo);

        await withTestStep(
          testInfo,
          "Wait for lang attribute to be set",
          async () => {
            await expect(page.locator("html")).toHaveAttribute(
              "lang",
              /^[a-z]{2}(-[A-Z]{2})?$/
            );
          }
        );

        await withTestStep(testInfo, "Run accessibility scan", async () => {
          const violations = await runAccessibilityTest(
            "Landing Page",
            page,
            testInfo
          );
          expect
            .soft(violations, "Accessibility violations found:")
            .toHaveLength(0);
          if (violations.length > 0) {
            // Note: For future implementation.
          }
        });
      }
    );
  }
);
