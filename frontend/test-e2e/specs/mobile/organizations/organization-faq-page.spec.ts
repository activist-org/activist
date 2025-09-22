// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation
  await navigateToOrganizationSubpage(page, "faq");
});

test.describe("Organization FAQ Page - Mobile", { tag: "@mobile" }, () => {
  test("User can reorder FAQ entries using drag and drop on mobile", async ({
    page,
  }) => {
    const organizationPage = newOrganizationPage(page);
    const faqPage = organizationPage.faqPage;

    // Wait for FAQ entries to load completely
    await page.waitForLoadState("networkidle");

    const faqCount = await faqPage.getFAQCount();

    if (faqCount >= 2) {
      // Get initial order of first 2 FAQ questions for drag and drop test
      const firstQuestion = await faqPage.getFAQQuestionText(0);
      const secondQuestion = await faqPage.getFAQQuestionText(1);

      // Verify drag handles are visible
      const firstFAQDragHandle = faqPage.getFAQDragHandle(0);
      const secondFAQDragHandle = faqPage.getFAQDragHandle(1);

      await expect(firstFAQDragHandle).toBeVisible();
      await expect(secondFAQDragHandle).toBeVisible();

      // Use hybrid approach: touch events + drag events for vuedraggable
      const firstHandleBox = await faqPage.getFAQDragHandlePosition(0);
      const secondHandleBox = await faqPage.getFAQDragHandlePosition(1);

      if (firstHandleBox && secondHandleBox) {
        // Calculate start and end positions
        const startX = firstHandleBox.x + firstHandleBox.width / 2;
        const startY = firstHandleBox.y + firstHandleBox.height / 2;
        const endX = secondHandleBox.x + secondHandleBox.width / 2;
        const endY = secondHandleBox.y + secondHandleBox.height / 2;

        // Get the draggable container
        const draggableContainer = faqPage.faqList;

        // Start drag with both touch and drag events
        await firstFAQDragHandle.dispatchEvent("touchstart", {
          touches: [{ identifier: 0, clientX: startX, clientY: startY }],
          changedTouches: [{ identifier: 0, clientX: startX, clientY: startY }],
          targetTouches: [{ identifier: 0, clientX: startX, clientY: startY }],
        });

        // Small delay to ensure touchstart is processed
        await page.waitForTimeout(100);

        // Trigger dragstart event that vuedraggable expects
        await firstFAQDragHandle.dispatchEvent("dragstart");

        // Simulate touch move with intermediate steps
        const steps = 5; // Fewer steps for more reliable movement
        for (let i = 1; i <= steps; i++) {
          const currentX = startX + ((endX - startX) * i) / steps;
          const currentY = startY + ((endY - startY) * i) / steps;

          // Touch move
          await firstFAQDragHandle.dispatchEvent("touchmove", {
            touches: [{ identifier: 0, clientX: currentX, clientY: currentY }],
            changedTouches: [
              { identifier: 0, clientX: currentX, clientY: currentY },
            ],
            targetTouches: [
              { identifier: 0, clientX: currentX, clientY: currentY },
            ],
          });

          // Drag over event for vuedraggable
          await draggableContainer.dispatchEvent("dragover");

          // Small delay between steps
          await page.waitForTimeout(50);
        }

        // Complete the drag operation
        await firstFAQDragHandle.dispatchEvent("touchend", {
          changedTouches: [{ identifier: 0, clientX: endX, clientY: endY }],
        });

        // Small delay to ensure touchend is processed
        await page.waitForTimeout(100);

        // Trigger drop event that vuedraggable expects
        await draggableContainer.dispatchEvent("drop");

        // Wait for the reorder operation to complete (including network requests)
        await page.waitForLoadState("networkidle");

        // Get final order of first 2 FAQ questions
        const finalFirstQuestion = await faqPage.getFAQQuestionText(0);
        const finalSecondQuestion = await faqPage.getFAQQuestionText(1);

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
});
