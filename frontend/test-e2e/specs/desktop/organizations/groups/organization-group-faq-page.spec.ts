// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

test.beforeEach(async ({ page }) => {
  await signInAsAdmin(page);
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
      const groupFaqPage = organizationPage.groupFaqPage;

      // Wait for FAQ entries to load completely
      await page.waitForLoadState("networkidle");

      const faqCount = await groupFaqPage.getFaqCount();

      if (faqCount >= 2) {
        // Get initial order of first 2 FAQ questions for drag and drop test
        const firstQuestion = await groupFaqPage.getFaqQuestionText(0);
        const secondQuestion = await groupFaqPage.getFaqQuestionText(1);

        // Verify drag handles are visible
        const firstFaqDragHandle = groupFaqPage.getFaqDragHandle(0);
        const secondFaqDragHandle = groupFaqPage.getFaqDragHandle(1);

        await expect(firstFaqDragHandle).toBeVisible();
        await expect(secondFaqDragHandle).toBeVisible();

        // Perform drag and drop from first to second position
        const firstHandleBox = await groupFaqPage.getFaqDragHandlePosition(0);
        const secondHandleBox = await groupFaqPage.getFaqDragHandlePosition(1);

        if (firstHandleBox && secondHandleBox) {
          // Drag first FAQ to second position
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

          // Wait for the reorder operation to complete (including network requests)
          await page.waitForLoadState("networkidle");

          // Get final order of first 2 FAQ questions
          const finalFirstQuestion = await groupFaqPage.getFaqQuestionText(0);
          const finalSecondQuestion = await groupFaqPage.getFaqQuestionText(1);

          // Verify the order has changed (first and second should be swapped)
          expect(finalFirstQuestion).toBe(secondQuestion);
          expect(finalSecondQuestion).toBe(firstQuestion);
        }
      } else {
        // Skip test if insufficient FAQ entries for drag and drop testing
        test.skip(
          faqCount >= 2,
          "Need at least 2 FAQ entries to test drag and drop functionality"
        );
      }
    });
  }
);
