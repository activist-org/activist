// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";

test.beforeEach(async ({ page }) => {
  await page.goto("/organizations");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /organizations/i
  );
});

test.describe("Organizations Page", { tag: ["@desktop", "@mobile"] }, () => {
  // Note: Check to make sure that this is eventually done for light and dark modes.
  test("Organizations Page has no detectable accessibility issues", async ({
    page,
  }, testInfo) => {
    const violations = await runAccessibilityTest(
      "Organizations Page",
      page,
      testInfo
    );
    expect.soft(violations, "Accessibility violations found:").toHaveLength(0);

    if (violations.length > 0) {
      console.log(
        "Accessibility violations:",
        JSON.stringify(violations, null, 2)
      );
    }
  });
});
