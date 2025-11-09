// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation.
  await navigateToOrganizationSubpage(page, "faq");
});

test.describe("Organization FAQ Page", { tag: ["@desktop", "@mobile"] }, () => {
  // MARK: - Accessibility

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

  // MARK: - CRUD Operations

  test("User can manage FAQ entries (CREATE, UPDATE, DELETE)", async ({
    page,
  }) => {
    const organizationPage = newOrganizationPage(page);
    const { faqPage } = organizationPage;

    await page.waitForLoadState("domcontentloaded");

    // Generate unique content for this test run.
    const timestamp = Date.now();
    const newQuestion = `Test FAQ Question ${timestamp}`;
    const newAnswer = `This is a test FAQ answer created at ${timestamp}.`;
    const updatedQuestion = `Updated FAQ Question ${timestamp}`;
    const updatedAnswer = `This is an updated FAQ answer at ${timestamp}.`;

    // MARK: Create

    const initialFaqCount = await faqPage.getFAQCount();

    // Verify new FAQ button is visible and functional.
    await expect(faqPage.newFAQButton).toBeVisible();
    await expect(faqPage.newFAQButton).toBeEnabled();

    // Click the new FAQ button.
    await faqPage.newFAQButton.click();

    // Verify modal opens.
    await expect(faqPage.faqModal).toBeVisible();

    // Verify form elements are present.
    const questionInput = faqPage.faqQuestionInput(faqPage.faqModal);
    const answerInput = faqPage.faqAnswerInput(faqPage.faqModal);
    const submitButton = faqPage.faqSubmitButton(faqPage.faqModal);

    await expect(questionInput).toBeVisible();
    await expect(answerInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Fill in the form.
    await questionInput.fill(newQuestion);
    await answerInput.fill(newAnswer);

    // Verify form fields contain the entered text.
    await expect(questionInput).toHaveValue(newQuestion);
    await expect(answerInput).toHaveValue(newAnswer);

    // Submit the form.
    await submitButton.click();

    // Wait for modal to close.
    await expect(faqPage.faqModal).not.toBeVisible();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Verify the new FAQ appears on the page (don't check exact count as there may be existing FAQs).
    const newFaqCard = faqPage.faqCards.filter({ hasText: newQuestion });
    await expect(newFaqCard).toBeVisible();

    // Verify FAQ count increased by checking that our FAQ exists.
    const afterCreateCount = await faqPage.getFAQCount();
    expect(afterCreateCount).toBeGreaterThanOrEqual(initialFaqCount + 1);

    // Expand and verify the answer.
    const disclosureButton = newFaqCard.getByTestId("faq-disclosure-button");
    await disclosureButton.click();

    const answerElement = newFaqCard.getByTestId("faq-answer");
    await expect(answerElement).toBeVisible();
    await expect(answerElement).toContainText(newAnswer);

    // MARK: Update

    // Edit the FAQ we just created.
    const editButton = newFaqCard.getByTestId("faq-edit-button");
    await editButton.click();

    // Verify edit modal opens.
    await expect(faqPage.editFAQModal).toBeVisible();

    // Get form elements for editing.
    const editQuestionInput = faqPage.faqQuestionInput(faqPage.editFAQModal);
    const editAnswerInput = faqPage.faqAnswerInput(faqPage.editFAQModal);
    const editSubmitButton = faqPage.faqSubmitButton(faqPage.editFAQModal);

    // Clear and fill with updated content.
    await editQuestionInput.clear();
    await editQuestionInput.fill(updatedQuestion);
    await editAnswerInput.clear();
    await editAnswerInput.fill(updatedAnswer);

    // Verify updated content.
    await expect(editQuestionInput).toHaveValue(updatedQuestion);
    await expect(editAnswerInput).toHaveValue(updatedAnswer);

    // Submit the edit.
    await editSubmitButton.click();

    // Wait for modal to close.
    await expect(faqPage.editFAQModal).not.toBeVisible();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Verify the updated FAQ appears on the page.
    const updatedFaqCard = faqPage.faqCards.filter({
      hasText: updatedQuestion,
    });
    await expect(updatedFaqCard).toBeVisible();

    // Verify old question is gone.
    await expect(
      faqPage.faqCards.filter({ hasText: newQuestion })
    ).not.toBeVisible();

    // Expand and verify the updated answer.
    const updatedDisclosureButton = updatedFaqCard.getByTestId(
      "faq-disclosure-button"
    );
    const isExpanded = await updatedFaqCard
      .getByTestId("faq-answer")
      .isVisible();
    if (!isExpanded) {
      await updatedDisclosureButton.click();
    }

    const updatedAnswerElement = updatedFaqCard.getByTestId("faq-answer");
    await expect(updatedAnswerElement).toBeVisible();
    await expect(updatedAnswerElement).toContainText(updatedAnswer);

    // MARK: Delete

    // Delete the FAQ we created and edited.
    const deleteButton = updatedFaqCard.getByTestId("faq-delete-button");
    await deleteButton.click();

    // Verify confirmation modal opens.
    const confirmationModal = page.locator("#modal").first();
    await expect(confirmationModal).toBeVisible();

    // Confirm deletion.
    const confirmButton = confirmationModal.getByRole("button", {
      name: /confirm|yes|delete/i,
    });
    await confirmButton.click();

    // Wait for modal to close.
    await expect(confirmationModal).not.toBeVisible();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Verify the FAQ is no longer visible.
    await expect(
      faqPage.faqCards.filter({ hasText: updatedQuestion })
    ).not.toBeVisible();

    // Verify FAQ count decreased (should be back to initial or less if we successfully deleted).
    const finalFaqCount = await faqPage.getFAQCount();
    expect(finalFaqCount).toBeLessThanOrEqual(afterCreateCount - 1);
  });

  // MARK: - View and Interact

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
});
