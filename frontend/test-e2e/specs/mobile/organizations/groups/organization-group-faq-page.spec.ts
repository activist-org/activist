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
  "Organization Group FAQ Page - Mobile",
  { tag: "@mobile" },
  () => {
    test("User can reorder FAQ entries using drag and drop on mobile", async ({
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

        // Verify drag handles are visible and get their properties
        const firstFaqDragHandle = groupFaqPage.getFaqDragHandle(0);
        const secondFaqDragHandle = groupFaqPage.getFaqDragHandle(1);

        // Quick validation that drag handles are ready
        await expect(firstFaqDragHandle).toBeVisible();
        await expect(secondFaqDragHandle).toBeVisible();

        // Validate drag handles have the correct CSS class using new Playwright v1.52 API
        await expect(firstFaqDragHandle).toContainClass("drag-handle");
        await expect(secondFaqDragHandle).toContainClass("drag-handle");

        // Use mouse events for mobile drag and drop (touch events don't work)
        const firstBox = await firstFaqDragHandle.boundingBox();
        const secondBox = await secondFaqDragHandle.boundingBox();

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

        // Wait for the reorder operation to complete (including network requests)
        await page.waitForLoadState("networkidle");

        // Get final order of first 2 FAQ questions
        const finalFirstQuestion = await groupFaqPage.getFaqQuestionText(0);
        const finalSecondQuestion = await groupFaqPage.getFaqQuestionText(1);

        // Verify the order has changed (first and second should be swapped)
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
  }
);
