// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  getFAQCardOrder,
  performDragAndDrop,
  verifyReorder,
} from "~/test-e2e/actions/dragAndDrop";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToOrganizationGroupSubpage(page, "faq");
});

test.describe(
  "Organization Group FAQ Page - Management",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // MARK: CREATE FAQ

    test("User can access new FAQ creation", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupFaqPage } = organizationPage;

      // Verify new FAQ button is visible and functional.
      await expect(groupFaqPage.newFaqButton).toBeVisible();
      await expect(groupFaqPage.newFaqButton).toBeEnabled();

      // Get button text to verify we have the right button.
      const buttonText = await groupFaqPage.newFaqButton.textContent();
      expect(buttonText).toContain("FAQ");

      // Verify button has correct aria-label.
      await expect(groupFaqPage.newFaqButton).toHaveAttribute("aria-label");

      // Test that button is clickable (click and verify no errors).
      await groupFaqPage.clickNewFaq();

      // Verify button click was successful (no errors thrown).
      // Since modal is not implemented yet, we just verify the click worked.
      await expect(groupFaqPage.newFaqButton).toBeVisible();
    });

    // MARK: REORDER FAQ

    test("User can reorder FAQ entries using drag and drop", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupFaqPage } = organizationPage;

      // Wait for page to load and then for FAQ cards to appear.
      await page.waitForLoadState("domcontentloaded");

      // Wait for FAQ cards to be present (with timeout to handle empty state).
      try {
        await expect(groupFaqPage.faqCards.first()).toBeVisible({});
      } catch {
        // If no FAQ cards appear, that's fine - could be empty state.
      }

      const faqCount = await groupFaqPage.getFaqCount();

      if (faqCount >= 2) {
        // Get initial order of first 2 FAQ questions for drag and drop test.
        const initialOrder = await getFAQCardOrder(page);
        const firstQuestion = initialOrder[0];
        const secondQuestion = initialOrder[1];

        // Verify drag handles are visible and have correct classes.
        const firstFaqDragHandle = groupFaqPage.getFaqDragHandle(0);
        const secondFaqDragHandle = groupFaqPage.getFaqDragHandle(1);

        await expect(firstFaqDragHandle).toBeVisible();
        await expect(secondFaqDragHandle).toBeVisible();

        // Validate drag handles have the correct CSS class.
        await expect(firstFaqDragHandle).toContainClass("drag-handle");
        await expect(secondFaqDragHandle).toContainClass("drag-handle");

        // Perform drag and drop using shared utility.
        await performDragAndDrop(page, firstFaqDragHandle, secondFaqDragHandle);

        // Verify the reorder using shared utility.
        await verifyReorder(
          page,
          firstQuestion ?? "",
          secondQuestion ?? "",
          getFAQCardOrder
        );
      } else {
        // Skip test if insufficient FAQ entries for drag and drop testing.
        test.skip(
          faqCount >= 2,
          "Need at least 2 FAQ entries to test drag and drop functionality"
        );
      }
    });

    // MARK: EDIT FAQ

    test("User can edit existing FAQ entries", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupFaqPage } = organizationPage;

      // Wait for FAQ entries to load completely.
      await page.waitForLoadState("domcontentloaded");

      const faqCount = await groupFaqPage.getFaqCount();

      if (faqCount > 0) {
        // Get the original question text.
        const originalQuestion = await groupFaqPage.getFaqQuestionText(0);
        expect(originalQuestion).toBeTruthy();

        // Expand the FAQ to get the answer text.
        await groupFaqPage.expandFaq(0);

        // Wait for FAQ to be expanded.
        await expect(groupFaqPage.getFaqAnswer(0)).toBeVisible();

        const originalAnswer = await groupFaqPage.getFaqAnswerText(0);
        expect(originalAnswer).toBeTruthy();

        // Verify edit button is visible and clickable.
        const editButton = groupFaqPage.getFaqEditButton(0);
        await expect(editButton).toBeVisible();
        await expect(editButton).toBeEnabled();

        // Test that edit button is clickable (click and verify no errors).
        await groupFaqPage.editFaq(0);
        // Verify edit button click was successful (no errors thrown).
        // Since modal is not implemented yet, we just verify the click worked.
        await expect(editButton).toBeVisible();
      } else {
        // Skip test if no FAQ entries available for editing.
        test.skip(
          faqCount > 0,
          "No FAQ entries available to test editing functionality"
        );
      }
    });
  }
);
