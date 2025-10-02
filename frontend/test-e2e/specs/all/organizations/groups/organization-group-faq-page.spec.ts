// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState
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

    test("User can view and interact with FAQ entries", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupFaqPage = organizationPage.groupFaqPage;

      // Wait for FAQ entries to load completely
      await page.waitForLoadState("domcontentloaded");

      // Wait for either FAQ entries or empty state to appear
      await expect(async () => {
        const faqListVisible = await groupFaqPage.faqList
          .isVisible()
          .catch(() => false);
        const emptyStateVisible = await groupFaqPage.emptyState
          .isVisible()
          .catch(() => false);
        expect(faqListVisible || emptyStateVisible).toBe(true);
      }).toPass({ timeout: 10000 });

      const faqCount = await groupFaqPage.getFaqCount();

      if (faqCount > 0) {
        // Verify FAQ list is visible
        await expect(groupFaqPage.faqList).toBeVisible();
        await expect(groupFaqPage.faqCards.first()).toBeVisible();

        // Verify first FAQ has required elements
        const firstFaqCard = groupFaqPage.getFaqCard(0);
        await expect(firstFaqCard).toBeVisible();

        const firstFaqQuestion = groupFaqPage.getFaqQuestion(0);
        await expect(firstFaqQuestion).toBeVisible();

        const firstFaqDisclosureButton = groupFaqPage.getFaqDisclosureButton(0);
        await expect(firstFaqDisclosureButton).toBeVisible();

        // Test expanding FAQ
        await groupFaqPage.expandFaq(0);
        await expect(groupFaqPage.getFaqAnswer(0)).toBeVisible();

        // Test collapsing FAQ
        await groupFaqPage.collapseFaq(0);
        await expect(groupFaqPage.getFaqAnswer(0)).not.toBeVisible();

        // Verify drag handles are visible
        const firstFaqDragHandle = groupFaqPage.getFaqDragHandle(0);
        await expect(firstFaqDragHandle).toBeVisible();
        await expect(firstFaqDragHandle).toContainClass("drag-handle");

        // Verify edit buttons are visible
        const firstFaqEditButton = groupFaqPage.getFaqEditButton(0);
        await expect(firstFaqEditButton).toBeVisible();
      } else {
        // Verify empty state is shown when no FAQ entries
        await expect(groupFaqPage.emptyState).toBeVisible();
        await expect(groupFaqPage.emptyStateMessage).toBeVisible();
      }
    });

    test("User can access new FAQ creation", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupFaqPage = organizationPage.groupFaqPage;

      // Verify new FAQ button is visible and functional
      await expect(groupFaqPage.newFaqButton).toBeVisible();
      await expect(groupFaqPage.newFaqButton).toBeEnabled();

      // Get button text to verify we have the right button
      const buttonText = await groupFaqPage.newFaqButton.textContent();
      expect(buttonText).toContain("FAQ");

      // Verify button has correct aria-label
      await expect(groupFaqPage.newFaqButton).toHaveAttribute("aria-label");

      // Test that button is clickable (click and verify no errors)
      await groupFaqPage.clickNewFaq();

      // Verify button click was successful (no errors thrown)
      // Since modal is not implemented yet, we just verify the click worked
      await expect(groupFaqPage.newFaqButton).toBeVisible();
    });

    test("User can reorder FAQ entries using drag and drop", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupFaqPage = organizationPage.groupFaqPage;

      // Wait for page to load and then for FAQ cards to appear
      await page.waitForLoadState("domcontentloaded");

      // Wait for FAQ cards to be present (with timeout to handle empty state)
      try {
        await expect(groupFaqPage.faqCards.first()).toBeVisible({
          timeout: 5000,
        });
      } catch {
        // If no FAQ cards appear, that's fine - could be empty state
      }

      const faqCount = await groupFaqPage.getFaqCount();

      if (faqCount >= 2) {
        // Get initial order of first 2 FAQ questions for drag and drop test
        const firstQuestion = await groupFaqPage.getFaqQuestionText(0);
        const secondQuestion = await groupFaqPage.getFaqQuestionText(1);

        // Verify drag handles are visible and have correct classes
        const firstFaqDragHandle = groupFaqPage.getFaqDragHandle(0);
        const secondFaqDragHandle = groupFaqPage.getFaqDragHandle(1);

        await expect(firstFaqDragHandle).toBeVisible();
        await expect(secondFaqDragHandle).toBeVisible();

        // Validate drag handles have the correct CSS class
        await expect(firstFaqDragHandle).toContainClass("drag-handle");
        await expect(secondFaqDragHandle).toContainClass("drag-handle");

        // Use mouse events for reliable drag and drop
        const firstBox = await groupFaqPage.getFaqDragHandlePosition(0);
        const secondBox = await groupFaqPage.getFaqDragHandlePosition(1);

        if (firstBox && secondBox) {
          const startX = firstBox.x + firstBox.width / 2;
          const startY = firstBox.y + firstBox.height / 2;
          const endX = secondBox.x + secondBox.width / 2;
          const endY = secondBox.y + secondBox.height / 2;

          // Simulate drag with mouse events
          await page.mouse.move(startX, startY);
          await page.mouse.down();
          await page.waitForTimeout(100);

          // Move to target with intermediate steps
          const steps = 5;
          for (let i = 1; i <= steps; i++) {
            const progress = i / steps;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            await page.mouse.move(currentX, currentY);
            await page.waitForTimeout(50);
          }

          await page.mouse.up();
          await page.waitForTimeout(200);
        }

        // Wait for the reorder operation to complete
        await page.waitForLoadState("domcontentloaded");

        // Get final order after drag operation
        const finalFirstQuestion = await groupFaqPage.getFaqQuestionText(0);
        const finalSecondQuestion = await groupFaqPage.getFaqQuestionText(1);

        // Verify the drag operation worked (first and second should be swapped)
        expect(finalFirstQuestion).toBe(secondQuestion);
        expect(finalSecondQuestion).toBe(firstQuestion);
      } else {
        // Skip test if insufficient FAQ entries for drag and drop testing
        test.skip(
          faqCount >= 2,
          "Need at least 2 FAQ entries to test drag and drop functionality"
        );
      }
    });

    test("User can edit existing FAQ entries", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupFaqPage = organizationPage.groupFaqPage;

      // Wait for FAQ entries to load completely
      await page.waitForLoadState("domcontentloaded");

      const faqCount = await groupFaqPage.getFaqCount();

      if (faqCount > 0) {
        // Get the original question text
        const originalQuestion = await groupFaqPage.getFaqQuestionText(0);
        expect(originalQuestion).toBeTruthy();

        // Expand the FAQ to get the answer text
        await groupFaqPage.expandFaq(0);

        // Wait for FAQ to be expanded
        await expect(groupFaqPage.getFaqAnswer(0)).toBeVisible();

        const originalAnswer = await groupFaqPage.getFaqAnswerText(0);
        expect(originalAnswer).toBeTruthy();

        // Verify edit button is visible and clickable
        const editButton = groupFaqPage.getFaqEditButton(0);
        await expect(editButton).toBeVisible();
        await expect(editButton).toBeEnabled();

        // Test that edit button is clickable (click and verify no errors)
        await groupFaqPage.editFaq(0);

        // Verify edit button click was successful (no errors thrown)
        // Since modal is not implemented yet, we just verify the click worked
        await expect(editButton).toBeVisible();
      } else {
        // Skip test if no FAQ entries available for editing
        test.skip(
          faqCount > 0,
          "No FAQ entries available to test editing functionality"
        );
      }
    });
  }
);
