// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToOrganizationGroupSubpage(page, "faq");
});

test.describe(
  "Organization Group FAQ Page - Display",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // MARK: Accessibility

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

    // MARK: View Entries

    test("User can view and interact with FAQ entries", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupFaqPage } = organizationPage;

      // Wait for FAQ entries to load completely.
      await page.waitForLoadState("domcontentloaded");

      // Wait for either FAQ entries or empty state to appear.
      await expect(async () => {
        const faqListVisible = await groupFaqPage.faqList
          .isVisible()
          .catch(() => false);
        const emptyStateVisible = await groupFaqPage.emptyState
          .isVisible()
          .catch(() => false);
        expect(faqListVisible || emptyStateVisible).toBe(true);
      }).toPass();

      const faqCount = await groupFaqPage.getFaqCount();

      if (faqCount > 0) {
        // Verify FAQ list is visible.
        await expect(groupFaqPage.faqList).toBeVisible();
        await expect(groupFaqPage.faqCards.first()).toBeVisible();

        // Verify first FAQ has required elements.
        const firstFaqCard = groupFaqPage.getFaqCard(0);
        await expect(firstFaqCard).toBeVisible();

        const firstFaqQuestion = groupFaqPage.getFaqQuestion(0);
        await expect(firstFaqQuestion).toBeVisible();

        const firstFaqDisclosureButton = groupFaqPage.getFaqDisclosureButton(0);
        await expect(firstFaqDisclosureButton).toBeVisible();

        // Test expanding FAQ.
        await groupFaqPage.expandFaq(0);
        await expect(groupFaqPage.getFaqAnswer(0)).toBeVisible();

        // Test collapsing FAQ.
        await groupFaqPage.collapseFaq(0);
        await expect(groupFaqPage.getFaqAnswer(0)).not.toBeVisible();

        // Verify drag handles are visible.
        const firstFaqDragHandle = groupFaqPage.getFaqDragHandle(0);
        await expect(firstFaqDragHandle).toBeVisible();
        await expect(firstFaqDragHandle).toContainClass("drag-handle");
        // Verify edit buttons are visible.
        const firstFaqEditButton = groupFaqPage.getFaqEditButton(0);
        await expect(firstFaqEditButton).toBeVisible();
      } else {
        // Verify empty state is shown when no FAQ entries.
        await expect(groupFaqPage.emptyState).toBeVisible();
        await expect(groupFaqPage.emptyStateMessage).toBeVisible();
      }
    });
  }
);
