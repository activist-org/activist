// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import { navigateToFirstOrganization } from "~/test-e2e/actions/navigation";

test.beforeEach(async ({ page }) => {
  await signInAsAdmin(page);
  await navigateToFirstOrganization(page);
});

test.describe("Organization Page", { tag: ["@desktop", "@mobile"] }, () => {
  // Note: Check to make sure that this is eventually done for light and dark modes.
  test.skip("Organization Page has no detectable accessibility issues", async ({
    page,
  }, testInfo) => {
    const violations = await runAccessibilityTest(
      "Organization Page",
      page,
      testInfo
    );
    expect.soft(violations, "Accessibility violations found:").toHaveLength(0);

    if (violations.length > 0) {
      // Note: For future implementation.
    }
  });
});
