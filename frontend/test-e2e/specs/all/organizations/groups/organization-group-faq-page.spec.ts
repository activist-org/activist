// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Sign in as admin to access edit functionality
  await signInAsAdmin(page);
  // Navigate to a group FAQ page within an organization
  await navigateToOrganizationGroupSubpage(page, "faq");
});

test.describe(
  "Organization Group FAQ Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test("Organization Group FAQ Page has no detectable accessibility issues", async ({
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
          "Organization Group FAQ Page",
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

    test("Group FAQ page elements are accessible", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const groupFaqPage = organizationPage.groupFaqPage;

      await withTestStep(
        testInfo,
        "Verify new FAQ button is accessible",
        async () => {
          await expect(groupFaqPage.newFaqButton).toBeVisible();
          await expect(groupFaqPage.newFaqButton).toHaveAttribute("aria-label");
        }
      );

      await withTestStep(
        testInfo,
        "Verify tab navigation is accessible",
        async () => {
          await expect(groupFaqPage.tabs).toBeVisible();
          await expect(groupFaqPage.faqTab).toHaveAttribute(
            "aria-selected",
            "true"
          );
          await expect(groupFaqPage.aboutTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
          await expect(groupFaqPage.eventsTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
          await expect(groupFaqPage.resourcesTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
        }
      );

      await withTestStep(
        testInfo,
        "Verify FAQ content or empty state",
        async () => {
          if (await groupFaqPage.hasFaqEntries()) {
            // If FAQ entries exist, verify they are accessible
            const faqCount = await groupFaqPage.getFaqCount();
            expect(faqCount).toBeGreaterThan(0);

            // Check first FAQ card is accessible
            await expect(groupFaqPage.firstFaqCard).toBeVisible();

            // Verify FAQ disclosure buttons are accessible
            await expect(groupFaqPage.getFaqDisclosureButton(0)).toBeVisible();
            await expect(
              groupFaqPage.getFaqDisclosureButton(0)
            ).toHaveAttribute("aria-expanded");
          } else {
            // If no FAQ entries, verify empty state is accessible
            await expect(groupFaqPage.emptyState).toBeVisible();
            await expect(groupFaqPage.emptyStateMessage).toBeVisible();
          }
        }
      );
    });

    test("Group FAQ page disclosure interactions are accessible", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const groupFaqPage = organizationPage.groupFaqPage;

      // Only test if FAQ entries exist
      if (await groupFaqPage.hasFaqEntries()) {
        await withTestStep(
          testInfo,
          "Test FAQ disclosure button accessibility",
          async () => {
            const disclosureButton = groupFaqPage.getFaqDisclosureButton(0);
            await expect(disclosureButton).toBeVisible();
            await expect(disclosureButton).toHaveAttribute("aria-expanded");

            // Test expanding FAQ
            await groupFaqPage.clickFaqDisclosure(0);
            await expect(disclosureButton).toHaveAttribute(
              "aria-expanded",
              "true"
            );

            // Test collapsing FAQ
            await groupFaqPage.clickFaqDisclosure(0);
            await expect(disclosureButton).toHaveAttribute(
              "aria-expanded",
              "false"
            );
          }
        );
      }
    });
  }
);
