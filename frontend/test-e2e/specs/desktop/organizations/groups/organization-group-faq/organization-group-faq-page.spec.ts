// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToOrganizationGroupSubpage(page, "faq");
});

test.describe(
  "Organization Group FAQ Page - Desktop",
  { tag: "@desktop" },
  () => {
    test("User can reorder FAQ entries using drag and drop on desktop", async ({
      page,
    }) => {
      const organizationPage = newOrganizationPage(page);
      const { groupFaqPage } = organizationPage;

      // Wait for FAQ entries to load completely.
      await page.waitForLoadState("domcontentloaded");

      const faqCount = await groupFaqPage.getFaqCount();

      if (faqCount >= 2) {
        // Get initial order of first 2 FAQ questions for drag and drop test.
        const firstQuestion = await groupFaqPage.getFaqQuestionText(0);
        const secondQuestion = await groupFaqPage.getFaqQuestionText(1);

        // Verify drag handles are visible.
        const firstFaqDragHandle = groupFaqPage.getFaqDragHandle(0);
        const secondFaqDragHandle = groupFaqPage.getFaqDragHandle(1);

        await expect(firstFaqDragHandle).toBeVisible();
        await expect(secondFaqDragHandle).toBeVisible();

        // Perform drag and drop from first to second position.
        const firstHandleBox = await groupFaqPage.getFaqDragHandlePosition(0);
        const secondHandleBox = await groupFaqPage.getFaqDragHandlePosition(1);

        if (firstHandleBox && secondHandleBox) {
          // Drag first FAQ to second position.
          await page.mouse.move(
            firstHandleBox.x + firstHandleBox.width / 2,
            firstHandleBox.y + firstHandleBox.height / 2
          );
          await page.mouse.down();
          await page.mouse.move(
            secondHandleBox.x + secondHandleBox.width / 2,
            secondHandleBox.y + secondHandleBox.height / 2
          );
          await page.mouse.up();

          // Wait for the reorder operation to complete (including network requests).
          await page.waitForLoadState("domcontentloaded");

          // Get final order of first 2 FAQ questions.
          const finalFirstQuestion = await groupFaqPage.getFaqQuestionText(0);
          const finalSecondQuestion = await groupFaqPage.getFaqQuestionText(1);

          // Verify the order has changed (first and second should be swapped).
          expect(finalFirstQuestion).toBe(secondQuestion);
          expect(finalSecondQuestion).toBe(firstQuestion);
        }
      } else {
        // Skip test if insufficient FAQ entries for drag and drop testing.
        test.skip(
          faqCount >= 2,
          "Need at least 2 FAQ entries to test drag and drop functionality"
        );
      }
    });
  }
);
