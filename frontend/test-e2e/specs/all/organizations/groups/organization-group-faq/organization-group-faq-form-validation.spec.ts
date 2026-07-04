// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

const questionRequired = getEnglishText(
  "i18n.components.form_faq_entry.question_required"
);
const answerRequired = getEnglishText(
  "i18n.components.form_faq_entry.answer_required"
);

test.beforeEach(async ({ page }) => {
  // Already authenticated as admin via global storageState.
  await navigateToOrganizationGroupSubpage(page, "faq");
});

test.describe(
  "Organization Group FAQ Modal - Form Validation",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // MARK: Empty submission

    test("submitting an empty FAQ form shows inline errors and keeps the modal open", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupFaqPage } = newOrganizationPage(page);

      await groupFaqPage.clickNewFaq();
      const modal = groupFaqPage.faqModal;
      await expect(modal).toBeVisible();

      await groupFaqPage.getFaqSubmitButton(modal).click();

      await expect(modal).toBeVisible();

      const questionError = modal.getByTestId("form-item-question-error");
      const answerError = modal.getByTestId("form-item-answer-error");
      await expect(questionError).toBeVisible();
      await expect(answerError).toBeVisible();
      await expect(questionError).toContainText(questionRequired);
      await expect(answerError).toContainText(answerRequired);
    });

    // MARK: Partial submission

    test("filling only the question leaves an error on the answer", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupFaqPage } = newOrganizationPage(page);

      await groupFaqPage.clickNewFaq();
      const modal = groupFaqPage.faqModal;
      await expect(modal).toBeVisible();

      await groupFaqPage
        .getFaqQuestionInput(modal)
        .fill("E2E partial FAQ question");
      await groupFaqPage.getFaqSubmitButton(modal).click();

      await expect(modal).toBeVisible();
      await expect(
        modal.getByTestId("form-item-question-error")
      ).not.toBeVisible();
      await expect(modal.getByTestId("form-item-answer-error")).toBeVisible();
    });

    // MARK: Correction

    test("correcting all errors submits the form and closes the modal", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupFaqPage } = newOrganizationPage(page);

      await groupFaqPage.clickNewFaq();
      const modal = groupFaqPage.faqModal;
      await expect(modal).toBeVisible();

      // Trigger validation errors first.
      await groupFaqPage.getFaqSubmitButton(modal).click();
      await expect(modal.getByTestId("form-item-question-error")).toBeVisible();

      // Correct the form with valid data.
      const timestamp = Date.now();
      const question = `E2E Validation FAQ ${timestamp}`;
      const answer = `Corrected FAQ answer ${timestamp}.`;

      await groupFaqPage.getFaqQuestionInput(modal).fill(question);
      await groupFaqPage.getFaqAnswerInput(modal).fill(answer);
      await groupFaqPage.getFaqSubmitButton(modal).click();

      // Modal closes and the new entry appears in the list.
      await expect(modal).not.toBeVisible();
      await page.waitForLoadState("domcontentloaded");
      await expect(
        groupFaqPage.faqCards.filter({ hasText: question })
      ).toBeVisible();
    });
  }
);
