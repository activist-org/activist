// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Navigate to a group about page within an organization
  await navigateToOrganizationGroupSubpage(page, "about");
});

test.describe(
  "Organization Group About Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test("Organization Group About Page has no detectable accessibility issues", async ({
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
          "Organization Group About Page",
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

    test("Group about page elements are accessible", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const groupAboutPage = organizationPage.groupAboutPage;

      await withTestStep(
        testInfo,
        "Verify join group button is accessible",
        async () => {
          if (await groupAboutPage.isJoinGroupButtonVisible()) {
            await expect(groupAboutPage.joinGroupButton).toBeVisible();
            await expect(groupAboutPage.joinGroupButton).toHaveAttribute(
              "aria-label"
            );
          }
        }
      );

      await withTestStep(
        testInfo,
        "Verify share button is accessible",
        async () => {
          await expect(groupAboutPage.shareButton).toBeVisible();
          await expect(groupAboutPage.shareButton).toHaveAttribute(
            "aria-label"
          );
        }
      );

      await withTestStep(
        testInfo,
        "Verify tab navigation is accessible",
        async () => {
          await expect(groupAboutPage.tabs).toBeVisible();
          await expect(groupAboutPage.aboutTab).toHaveAttribute(
            "aria-selected",
            "true"
          );
          await expect(groupAboutPage.eventsTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
          await expect(groupAboutPage.resourcesTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
          await expect(groupAboutPage.faqTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
        }
      );

      await withTestStep(
        testInfo,
        "Verify about card is accessible",
        async () => {
          if (await groupAboutPage.isAboutCardVisible()) {
            await expect(groupAboutPage.aboutCard).toBeVisible();
          }
        }
      );
    });

    test("Group about page tab navigation works correctly", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const groupAboutPage = organizationPage.groupAboutPage;

      await withTestStep(testInfo, "Navigate to events tab", async () => {
        await groupAboutPage.clickEventsTab();
        await expect(groupAboutPage.eventsTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupAboutPage.aboutTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Navigate to resources tab", async () => {
        await groupAboutPage.clickResourcesTab();
        await expect(groupAboutPage.resourcesTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupAboutPage.eventsTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Navigate to FAQ tab", async () => {
        await groupAboutPage.clickFaqTab();
        await expect(groupAboutPage.faqTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupAboutPage.resourcesTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Return to about tab", async () => {
        await groupAboutPage.clickAboutTab();
        await expect(groupAboutPage.aboutTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupAboutPage.faqTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });
    });
  }
);
