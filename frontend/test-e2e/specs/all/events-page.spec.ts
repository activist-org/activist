// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";

test.beforeEach(async ({ page }) => {
  await page.goto("/events");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/events/i);
});

test.describe("Events Page", { tag: ["@desktop", "@mobile"] }, () => {
  // Note: Check to make sure that this is eventually done for light and dark modes.
  test.skip("Events Page has no detectable accessibility issues", async ({
    page,
  }, testInfo) => {
    const violations = await runAccessibilityTest(
      "Events Page",
      page,
      testInfo
    );
    expect.soft(violations, "Accessibility violations found:").toHaveLength(0);

    if (violations.length > 0) {
      // Note: For future implementation.
    }
  });
});
