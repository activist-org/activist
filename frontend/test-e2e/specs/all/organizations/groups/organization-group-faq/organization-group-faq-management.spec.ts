// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  getFAQCardOrder,
  performDragAndDrop,
  verifyReorder,
} from "~/test-e2e/actions/dragAndDrop";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

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

      const timestamp = Date.now();
      const testQuestion = `Test FAQ Question ${timestamp}`;
      const testAnswer = `This is a test FAQ answer created at ${timestamp}.`;

      await withTestStep(
        testInfo,
        "New FAQ button and create modal",
        async () => {
          await expect(groupFaqPage.newFaqButton).toBeVisible();
          await expect(groupFaqPage.newFaqButton).toBeEnabled();

          const buttonText = await groupFaqPage.newFaqButton.textContent();
          expect(buttonText).toContain("FAQ");

          await expect(groupFaqPage.newFaqButton).toHaveAttribute("aria-label");

          await groupFaqPage.clickNewFaq();
          await expect(groupFaqPage.faqModal).toBeVisible();

          await expect(
            groupFaqPage.getFaqQuestionInput(groupFaqPage.faqModal)
          ).toBeVisible();
          await expect(
            groupFaqPage.getFaqAnswerInput(groupFaqPage.faqModal)
          ).toBeVisible();
          await expect(
            groupFaqPage.getFaqSubmitButton(groupFaqPage.faqModal)
          ).toBeVisible();
        }
      );

      await withTestStep(testInfo, "Submit new FAQ", async () => {
        await groupFaqPage.fillFaqForm(
          groupFaqPage.faqModal,
          testQuestion,
          testAnswer
        );

        await expect(
          groupFaqPage.getFaqQuestionInput(groupFaqPage.faqModal)
        ).toHaveValue(testQuestion);
        await expect(
          groupFaqPage.getFaqAnswerInput(groupFaqPage.faqModal)
        ).toHaveValue(testAnswer);

        await groupFaqPage.submitFaqForm(groupFaqPage.faqModal);
        await expect(groupFaqPage.faqModal).not.toBeVisible();
      });

      await withTestStep(testInfo, "Assert new FAQ in list with answer", async () => {
        await page.waitForTimeout(1000);

        const newFaqCard = groupFaqPage.faqCards.filter({
          hasText: testQuestion,
        });
        await expect(newFaqCard).toBeVisible();

        const disclosureButton = newFaqCard.getByTestId("faq-disclosure-button");
        const answerElement = newFaqCard.getByTestId("faq-answer");

        const isExpanded = await answerElement.isVisible();
        if (!isExpanded) {
          await disclosureButton.click();
        }

        await expect(answerElement).toBeVisible();
        await expect(answerElement).toContainText(testAnswer);
      });
    });

    // MARK: Reorder

    test("User can reorder FAQ entries using drag and drop", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupFaqPage } = organizationPage;

      await page.waitForLoadState("domcontentloaded");

      try {
        await expect(groupFaqPage.faqCards.first()).toBeVisible({});
      } catch {
        // empty state
      }

      const faqCount = await groupFaqPage.getFaqCount();

      if (faqCount >= 2) {
        const initialOrder = await withTestStep(
          testInfo,
          "Read initial FAQ order and drag handles",
          async () => {
            const order = await getFAQCardOrder(page);

            const firstFaqDragHandle = groupFaqPage.getFaqDragHandle(0);
            const secondFaqDragHandle = groupFaqPage.getFaqDragHandle(1);

            await expect(firstFaqDragHandle).toBeVisible();
            await expect(secondFaqDragHandle).toBeVisible();
            await expect(firstFaqDragHandle).toContainClass("drag-handle");
            await expect(secondFaqDragHandle).toContainClass("drag-handle");

            return {
              order,
              firstFaqDragHandle,
              secondFaqDragHandle,
            };
          }
        );

        const firstQuestion = initialOrder.order[0];
        const secondQuestion = initialOrder.order[1];

        await withTestStep(testInfo, "Drag reorder first FAQ", async () => {
          await performDragAndDrop(
            page,
            initialOrder.firstFaqDragHandle,
            initialOrder.secondFaqDragHandle
          );
        });

        await withTestStep(testInfo, "Verify FAQ order after drop", async () => {
          await verifyReorder(
            page,
            firstQuestion ?? "",
            secondQuestion ?? "",
            getFAQCardOrder
          );
        });
      } else {
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

      await page.waitForLoadState("domcontentloaded");

      const faqCount = await groupFaqPage.getFaqCount();

      if (faqCount > 0) {
        const timestamp = Date.now();
        const updatedQuestion = `Updated FAQ Question ${timestamp}`;
        const updatedAnswer = `This is an updated FAQ answer modified at ${timestamp}.`;

        const originalQuestion = await withTestStep(
          testInfo,
          "Open edit modal with original FAQ content",
          async () => {
            const q = await groupFaqPage.getFaqQuestionText(0);
            expect(q).toBeTruthy();

            await groupFaqPage.expandFaq(0);
            await expect(groupFaqPage.getFaqAnswer(0)).toBeVisible();

            const ans = await groupFaqPage.getFaqAnswerText(0);
            expect(ans).toBeTruthy();

            const editButton = groupFaqPage.getFaqEditButton(0);
            await expect(editButton).toBeVisible();
            await expect(editButton).toBeEnabled();

            await groupFaqPage.editFaq(0);
            await expect(groupFaqPage.editFaqModal).toBeVisible();

            await expect(
              groupFaqPage.getFaqQuestionInput(groupFaqPage.editFaqModal)
            ).toBeVisible();
            await expect(
              groupFaqPage.getFaqAnswerInput(groupFaqPage.editFaqModal)
            ).toBeVisible();
            await expect(
              groupFaqPage.getFaqSubmitButton(groupFaqPage.editFaqModal)
            ).toBeVisible();

            await expect(
              groupFaqPage.getFaqQuestionInput(groupFaqPage.editFaqModal)
            ).toHaveValue(q || "");
            await expect(
              groupFaqPage.getFaqAnswerInput(groupFaqPage.editFaqModal)
            ).toHaveValue(ans || "");

            return q || "";
          }
        );

        await withTestStep(testInfo, "Save edited FAQ", async () => {
          await groupFaqPage.fillFaqForm(
            groupFaqPage.editFaqModal,
            updatedQuestion,
            updatedAnswer
          );

          await expect(
            groupFaqPage.getFaqQuestionInput(groupFaqPage.editFaqModal)
          ).toHaveValue(updatedQuestion);
          await expect(
            groupFaqPage.getFaqAnswerInput(groupFaqPage.editFaqModal)
          ).toHaveValue(updatedAnswer);

          await groupFaqPage.submitFaqForm(groupFaqPage.editFaqModal);
          await expect(groupFaqPage.editFaqModal).not.toBeVisible();
        });

        await withTestStep(testInfo, "Assert updated FAQ on page", async () => {
          await page.waitForTimeout(1000);

          const updatedFaqCard = groupFaqPage.faqCards.filter({
            hasText: updatedQuestion,
          });
          await expect(updatedFaqCard).toBeVisible();

          const disclosureButton = updatedFaqCard.getByTestId(
            "faq-disclosure-button"
          );
          const answerElement = updatedFaqCard.getByTestId("faq-answer");

          const isExpanded = await answerElement.isVisible();
          if (!isExpanded) {
            await disclosureButton.click();
          }

          await expect(answerElement).toBeVisible();
          await expect(answerElement).toContainText(updatedAnswer);

          await expect(
            groupFaqPage.faqCards.filter({ hasText: originalQuestion })
          ).not.toBeVisible();
        });
      } else {
        test.skip(
          faqCount > 0,
          "No FAQ entries available to test editing functionality"
        );
      }
    });

    // MARK: Delete

    test("Delete button is visible and accessible on FAQ entries", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupFaqPage } = organizationPage;

      await page.waitForLoadState("domcontentloaded");
      const faqCount = await groupFaqPage.getFaqCount();

      if (faqCount > 0) {
        await withTestStep(testInfo, "Assert delete control on first FAQ", async () => {
          const deleteButton = page
            .getByTestId("faq-card")
            .first()
            .getByTestId("faq-delete-button");
          await expect(deleteButton).toBeVisible();
          await expect(deleteButton).toBeEnabled();
          await expect(deleteButton).toHaveAttribute("aria-label");
        });
      } else {
        test.skip(faqCount > 0, "No FAQ entries available to test deletion");
      }
    });

    test("User can cancel FAQ deletion", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupFaqPage } = organizationPage;

      await page.waitForLoadState("domcontentloaded");
      const initialFaqCount = await groupFaqPage.getFaqCount();

      if (initialFaqCount > 0) {
        const originalQuestion = await groupFaqPage.getFaqQuestionText(0);

        await withTestStep(testInfo, "Open delete confirmation then cancel", async () => {
          const deleteButton = page
            .getByTestId("faq-card")
            .first()
            .getByTestId("faq-delete-button");
          await deleteButton.evaluate((el: HTMLElement) => el.click());

          const confirmationModal = page.locator("#modal").first();
          await expect(confirmationModal).toBeVisible();
          await expect(confirmationModal).toContainText(/delete|remove/i);

          const cancelButton = confirmationModal.getByRole("button", {
            name: /cancel|no/i,
          });
          await cancelButton.click();

          await expect(confirmationModal).not.toBeVisible();
        });

        await withTestStep(testInfo, "Assert FAQ list unchanged", async () => {
          await page.waitForLoadState("domcontentloaded");

          const finalFaqCount = await groupFaqPage.getFaqCount();
          expect(finalFaqCount).toBe(initialFaqCount);

          const stillExistingQuestion = await groupFaqPage.getFaqQuestionText(0);
          expect(stillExistingQuestion).toBe(originalQuestion);
        });
      } else {
        test.skip(
          initialFaqCount > 0,
          "No FAQ entries available to test deletion"
        );
      }
    });

    test("User can successfully delete an FAQ entry", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupFaqPage } = organizationPage;

      await page.waitForLoadState("domcontentloaded");
      const initialFaqCount = await groupFaqPage.getFaqCount();

      if (initialFaqCount > 0) {
        const questionToDelete = await groupFaqPage.getFaqQuestionText(0);

        await withTestStep(testInfo, "Confirm delete on first FAQ", async () => {
          const deleteButton = page
            .getByTestId("faq-card")
            .first()
            .getByTestId("faq-delete-button");
          await deleteButton.evaluate((el: HTMLElement) => el.click());

          const confirmationModal = page.locator("#modal").first();
          await expect(confirmationModal).toBeVisible();

          const confirmButton = confirmationModal.getByRole("button", {
            name: /confirm|yes|delete/i,
          });
          await confirmButton.click();

          await expect(confirmationModal).not.toBeVisible();
        });

        await withTestStep(testInfo, "Assert FAQ removed from list", async () => {
          await page.waitForLoadState("domcontentloaded");
          await page.waitForTimeout(1000);

          const finalFaqCount = await groupFaqPage.getFaqCount();
          expect(finalFaqCount).toBe(initialFaqCount - 1);

          const deletedFaqCard = page
            .getByTestId("faq-card")
            .filter({ hasText: questionToDelete || "" });
          await expect(deletedFaqCard).not.toBeVisible();
        });
      } else {
        test.skip(
          initialFaqCount > 0,
          "No FAQ entries available to test deletion"
        );
      }
    });
  }
);
