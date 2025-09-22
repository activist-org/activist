// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation
  await navigateToOrganizationSubpage(page, "faq");
});

test.describe("Organization FAQ Page - Desktop", { tag: "@desktop" }, () => {
  test("User can reorder FAQ entries using drag and drop on desktop", async ({
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

      // Perform drag and drop from first to second position
      const firstHandleBox = await faqPage.getFAQDragHandlePosition(0);
      const secondHandleBox = await faqPage.getFAQDragHandlePosition(1);

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
