// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { newOrganizationsHomePage } from "~/test-e2e/page-objects/OrganizationsHomePage";
import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  const organizationsHomePage = newOrganizationsHomePage(page);

  await page.goto("/organizations");
  await expect(organizationsHomePage.heading).toHaveText(
    getEnglishText("i18n.pages.organizations.index.header_title")
  );
});

test.describe(
  "Organizations Home Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // Note: Check to make sure that this is eventually done for light and dark modes.
    test("Organizations Home Page has no detectable accessibility issues", async ({
      page,
    }, testInfo) => {
      const violations = await runAccessibilityTest(
        "Organizations Home Page",
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
