// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation.
  await navigateToOrganizationSubpage(page, "faq");
});

test.describe("Organization FAQ Page", { tag: ["@desktop", "@mobile"] }, () => {
  // Note: Check to make sure that this is eventually done for light and dark modes.
  test("Organization FAQ Page has no detectable accessibility issues", async ({
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
        "Organization FAQ Page",
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

  test("User can view and interact with FAQ entries", async ({ page }) => {
    const organizationPage = newOrganizationPage(page);
    const { faqPage } = organizationPage;

    // Wait for page to load completely.
    await page.waitForLoadState("domcontentloaded");

    // Wait for FAQ cards to be visible (since the page should have FAQ entries).
    await expect(faqPage.faqCards.first()).toBeVisible();

    // Wait for the page to be stable.
    await page.waitForLoadState("domcontentloaded");

    const faqCount = await faqPage.getFAQCount();

    if (faqCount > 0) {
      // Verify FAQ list and elements are visible.
      await expect(faqPage.faqList).toBeVisible();
      await expect(faqPage.faqCards.first()).toBeVisible();

      const firstFAQCard = faqPage.getFAQCard(0);
      const firstFAQQuestion = faqPage.getFAQQuestion(0);
      const firstFAQDragHandle = faqPage.getFAQDragHandle(0);
      const firstFAQEditButton = faqPage.getFAQEditButton(0);

      await expect(firstFAQCard).toBeVisible();
      await expect(firstFAQQuestion).toBeVisible();
      await expect(firstFAQQuestion).toContainText(/.+/);
      await expect(firstFAQDragHandle).toBeVisible();
      await expect(firstFAQEditButton).toBeVisible();

      // Test expand/collapse functionality.
      const isInitiallyExpanded = await faqPage.isFAQExpanded(0);
      expect(isInitiallyExpanded).toBe(false);

      // Expand FAQ.
      await faqPage.expandFAQ(0);

      // Wait for FAQ to be expanded.
      await expect(faqPage.getFAQAnswer(0)).toBeVisible();

      const answer = faqPage.getFAQAnswer(0);
      await expect(answer).toBeVisible();
      await expect(answer).toContainText(/.+/);

      // Collapse FAQ.
      await faqPage.expandFAQ(0);

      // Wait for FAQ to be collapsed.
      await expect(faqPage.getFAQAnswer(0)).not.toBeVisible();
    } else {
      // This should not happen since we expect FAQ entries to be present.
      throw new Error(
        "Expected FAQ entries to be present, but none were found"
      );
    }
  });

  test("User can edit existing FAQ entries", async ({ page }) => {
    const organizationPage = newOrganizationPage(page);
    const { faqPage } = organizationPage;

    // Wait for FAQ entries to load completely.
    await page.waitForLoadState("domcontentloaded");

    const faqCount = await faqPage.getFAQCount();

    if (faqCount > 0) {
      // Get the original question text.
      const originalQuestion = await faqPage.getFAQQuestionText(0);
      expect(originalQuestion).toBeTruthy();

      // Expand the FAQ to get the answer text.
      await faqPage.expandFAQ(0);

      // Wait for FAQ to be expanded.
      await expect(faqPage.getFAQAnswer(0)).toBeVisible();

      const originalAnswer = await faqPage.getFAQAnswerText(0);
      expect(originalAnswer).toBeTruthy();

      // Click the edit button for the first FAQ.
      await faqPage.editFAQ(0);

      // Verify edit modal opens.
      await expect(faqPage.editFAQModal).toBeVisible();

      // Get the modal and form elements.
      const editModal = faqPage.editFAQModal;
      const questionInput = faqPage.faqQuestionInput(editModal);
      const answerInput = faqPage.faqAnswerInput(editModal);
      const submitButton = faqPage.faqSubmitButton(editModal);

      // Generate unique test text with timestamp.
      const timestamp = Date.now();
      const updatedQuestionText = `Updated FAQ Question - Test Edit ${timestamp}`;
      const updatedAnswerText = `Updated FAQ Answer - This is a test edit to verify the functionality works correctly. Timestamp: ${timestamp}`;

      // Clear and update the question.
      await questionInput.clear();
      await questionInput.fill(updatedQuestionText);

      // Clear and update the answer.
      await answerInput.clear();
      await answerInput.fill(updatedAnswerText);

      // Submit the form.
      await submitButton.click();

      // Wait for the modal to close and changes to be saved.
      await expect(editModal).not.toBeVisible();
      await page.waitForLoadState("domcontentloaded");

      // Verify the changes were persisted.
      const updatedQuestion = await faqPage.getFAQQuestionText(0);
      expect(updatedQuestion).toBe(updatedQuestionText);

      // Wait for the FAQ to be ready for interaction after edit.
      await page.waitForLoadState("domcontentloaded");

      // Check if FAQ is already expanded, if not, expand it.
      const isAlreadyExpanded = await faqPage.isFAQExpanded(0);
      if (!isAlreadyExpanded) {
        await faqPage.expandFAQ(0);
      }

      // Wait for FAQ to be expanded and answer to be visible.
      await expect(faqPage.getFAQAnswer(0)).toBeVisible();

      const updatedAnswer = await faqPage.getFAQAnswerText(0);
      expect(updatedAnswer).toBe(updatedAnswerText);

      // Verify the changes are different from the original.
      expect(updatedQuestion).not.toBe(originalQuestion);
      expect(updatedAnswer).not.toBe(originalAnswer);
    } else {
      // Skip test if no FAQ entries are available.
      test.skip(faqCount > 0, "No FAQ entries available to test editing");
    }
  });
});
