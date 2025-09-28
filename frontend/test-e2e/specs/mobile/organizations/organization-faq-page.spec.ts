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

      // Verify drag handles are visible and get their properties
      const firstFAQDragHandle = faqPage.getFAQDragHandle(0);
      const secondFAQDragHandle = faqPage.getFAQDragHandle(1);

      // Quick validation that drag handles are ready
      await expect(firstFAQDragHandle).toBeVisible();
      await expect(secondFAQDragHandle).toBeVisible();

      // Ultra-fast drag simulation
      const firstBox = await firstFAQDragHandle.boundingBox();
      const secondBox = await secondFAQDragHandle.boundingBox();

      if (firstBox && secondBox) {
        // Start drag immediately
        await page.mouse.move(
          firstBox.x + firstBox.width / 2,
          firstBox.y + firstBox.height / 2
        );
        await page.mouse.down();
        await page.waitForTimeout(25);

        // Direct movement with minimal steps
        const steps = 5;
        for (let i = 1; i <= steps; i++) {
          const progress = i / steps;
          const currentX = firstBox.x + (secondBox.x - firstBox.x) * progress;
          const currentY = firstBox.y + (secondBox.y - firstBox.y) * progress;

          await page.mouse.move(currentX, currentY);
          await page.waitForTimeout(10);
        }

        // Quick target hover and release
        await page.mouse.move(
          secondBox.x + secondBox.width / 2,
          secondBox.y + secondBox.height / 2
        );
        await page.waitForTimeout(50);
        await page.mouse.up();
        await page.waitForTimeout(100);
      }

      // Wait for the reorder operation to complete (including network requests)
      await page.waitForLoadState("networkidle");

      // Get final order of first 2 FAQ questions
      const finalFirstQuestion = await faqPage.getFAQQuestionText(0);
      const finalSecondQuestion = await faqPage.getFAQQuestionText(1);

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
});
