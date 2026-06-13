// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationsHomePage } from "~/test-e2e/page-objects/OrganizationsHomePage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/test-traceability";

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
    });

    test("User can navigate to an organization about page", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await withTestStep(testInfo, "Click on first organization", async () => {
        const orgLink = page
          .getByRole("link", {
            name: getEnglishText(
              "i18n.components._global.navigate_to_organization_aria_label"
            ),
          })
          .first();
        await orgLink.click();
      });

      await withTestStep(
        testInfo,
        "Verify navigation to organization about page",
        async () => {
          await expect(page).toHaveURL(/.*\/organizations\/.*\/about/);
          await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        }
      );
    });
  }
);
