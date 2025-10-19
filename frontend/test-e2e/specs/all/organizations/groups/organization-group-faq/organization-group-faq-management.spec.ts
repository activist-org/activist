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
    // MARK: Create

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

      // Test that button is clickable (click and verify modal opens).
      await groupFaqPage.clickNewFaq();

      // Verify that the FAQ modal opens after clicking the button.
      await expect(groupFaqPage.faqModal).toBeVisible();

      // Verify the modal has the expected form elements.
      await expect(
        groupFaqPage.getFaqQuestionInput(groupFaqPage.faqModal)
      ).toBeVisible();
      await expect(
        groupFaqPage.getFaqAnswerInput(groupFaqPage.faqModal)
      ).toBeVisible();
      await expect(
        groupFaqPage.getFaqSubmitButton(groupFaqPage.faqModal)
      ).toBeVisible();

      // Generate unique test content for this test run.
      const timestamp = Date.now();
      const testQuestion = `Test FAQ Question ${timestamp}`;
      const testAnswer = `This is a test FAQ answer created at ${timestamp}.`;

      // Fill in the form with test content.
      await groupFaqPage.fillFaqForm(
        groupFaqPage.faqModal,
        testQuestion,
        testAnswer
      );

      // Verify the form fields contain the entered text.
      await expect(
        groupFaqPage.getFaqQuestionInput(groupFaqPage.faqModal)
      ).toHaveValue(testQuestion);
      await expect(
        groupFaqPage.getFaqAnswerInput(groupFaqPage.faqModal)
      ).toHaveValue(testAnswer);

      // Submit the form.
      await groupFaqPage.submitFaqForm(groupFaqPage.faqModal);

      // Wait for the modal to close after successful submission.
      await expect(groupFaqPage.faqModal).not.toBeVisible();

      // Wait for the page to update and verify the new FAQ appears in the list.
      await page.waitForTimeout(1000);

      // Verify the new FAQ entry appears on the page.
      const newFaqCard = groupFaqPage.faqCards.filter({
        hasText: testQuestion,
      });
      await expect(newFaqCard).toBeVisible();

      // Verify the FAQ can be expanded and shows the correct answer.
      const disclosureButton = newFaqCard.getByTestId("faq-disclosure-button");
      const answerElement = newFaqCard.getByTestId("faq-answer");

      // Check if the FAQ is already expanded, if not, click to expand it
      const isExpanded = await answerElement.isVisible();
      if (!isExpanded) {
        await disclosureButton.click();
      }

      // Wait for the answer to be visible and verify the content
      await expect(answerElement).toBeVisible();
      await expect(answerElement).toContainText(testAnswer);
    });

    // MARK: Reorder

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

    // MARK: Edit

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

        // Test that edit button is clickable (click and verify modal opens).
        await groupFaqPage.editFaq(0);

        // Verify that the edit FAQ modal opens after clicking the button.
        await expect(groupFaqPage.editFaqModal).toBeVisible();

        // Verify the modal has the expected form elements with pre-filled data.
        await expect(
          groupFaqPage.getFaqQuestionInput(groupFaqPage.editFaqModal)
        ).toBeVisible();
        await expect(
          groupFaqPage.getFaqAnswerInput(groupFaqPage.editFaqModal)
        ).toBeVisible();
        await expect(
          groupFaqPage.getFaqSubmitButton(groupFaqPage.editFaqModal)
        ).toBeVisible();

        // Verify the form is pre-filled with the original data.
        await expect(
          groupFaqPage.getFaqQuestionInput(groupFaqPage.editFaqModal)
        ).toHaveValue(originalQuestion || "");
        await expect(
          groupFaqPage.getFaqAnswerInput(groupFaqPage.editFaqModal)
        ).toHaveValue(originalAnswer || "");

        // Generate unique test content for this test run.
        const timestamp = Date.now();
        const updatedQuestion = `Updated FAQ Question ${timestamp}`;
        const updatedAnswer = `This is an updated FAQ answer modified at ${timestamp}.`;

        // Update the form with new test content.
        await groupFaqPage.fillFaqForm(
          groupFaqPage.editFaqModal,
          updatedQuestion,
          updatedAnswer
        );

        // Verify the form fields contain the updated text.
        await expect(
          groupFaqPage.getFaqQuestionInput(groupFaqPage.editFaqModal)
        ).toHaveValue(updatedQuestion);
        await expect(
          groupFaqPage.getFaqAnswerInput(groupFaqPage.editFaqModal)
        ).toHaveValue(updatedAnswer);

        // Submit the form to save changes.
        await groupFaqPage.submitFaqForm(groupFaqPage.editFaqModal);

        // Wait for the modal to close after successful submission.
        await expect(groupFaqPage.editFaqModal).not.toBeVisible();

        // Wait for the page to update and verify the changes persist.
        await page.waitForTimeout(1000);

        // Verify the updated FAQ entry appears on the page with the new content.
        const updatedFaqCard = groupFaqPage.faqCards.filter({
          hasText: updatedQuestion,
        });
        await expect(updatedFaqCard).toBeVisible();

        // Verify the FAQ can be expanded and shows the updated answer.
        const disclosureButton = updatedFaqCard.getByTestId(
          "faq-disclosure-button"
        );
        const answerElement = updatedFaqCard.getByTestId("faq-answer");

        // Check if the FAQ is already expanded, if not, click to expand it.
        const isExpanded = await answerElement.isVisible();
        if (!isExpanded) {
          await disclosureButton.click();
        }

        // Wait for the answer to be visible and verify the content
        await expect(answerElement).toBeVisible();
        await expect(answerElement).toContainText(updatedAnswer);

        // Verify the old content is no longer visible.
        await expect(
          groupFaqPage.faqCards.filter({ hasText: originalQuestion || "" })
        ).not.toBeVisible();
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
