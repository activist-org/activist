// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  getFAQCardOrder,
  performDragAndDrop,
  verifyReorder,
} from "~/test-e2e/actions/dragAndDrop";
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation.
  await navigateToOrganizationSubpage(page, "faq");
});

test.describe("Organization FAQ Page - Mobile", { tag: "@mobile" }, () => {
  test("User can reorder FAQ entries using drag and drop on mobile", async ({
    page,
  }) => {
    const organizationPage = newOrganizationPage(page);
    const { faqPage } = organizationPage;

    // Wait for FAQ entries to load completely.
    await page.waitForLoadState("domcontentloaded");

    const faqCount = await faqPage.getFAQCount();

    if (faqCount >= 2) {
      // Get initial order of first 2 FAQ questions for drag and drop test.
      const initialOrder = await getFAQCardOrder(page);
      const firstQuestion = initialOrder[0];
      const secondQuestion = initialOrder[1];

      // Verify drag handles are visible and get their properties.
      const firstFAQDragHandle = faqPage.getFAQDragHandle(0);
      const secondFAQDragHandle = faqPage.getFAQDragHandle(1);

      // Quick validation that drag handles are ready.
      await expect(firstFAQDragHandle).toBeVisible();
      await expect(secondFAQDragHandle).toBeVisible();

      // Validate drag handles have the correct CSS class.
      await expect(firstFAQDragHandle).toContainClass("drag-handle");
      await expect(secondFAQDragHandle).toContainClass("drag-handle");

      // Perform drag and drop using shared utility.
      // NOTE: We use mouse events with delays instead of dragTo() because
      // dragTo() executes too quickly for vuedraggable to process the drag sequence.
      await performDragAndDrop(page, firstFAQDragHandle, secondFAQDragHandle);

      // Verify the reorder using shared utility.
      await verifyReorder(
        page,
        firstQuestion ?? "",
        secondQuestion ?? "",
        getFAQCardOrder
      );
    } else {
      // Skip test if insufficient FAQ entries for drag and drop testing.
      test.skip(
        faqCount >= 2,
        "Need at least 2 FAQ entries to test drag and drop functionality"
      );
    }
  });
});
