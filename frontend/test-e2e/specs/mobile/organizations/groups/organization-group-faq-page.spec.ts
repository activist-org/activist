// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  getFAQCardOrder,
  performDragAndDrop,
  verifyReorder,
} from "~/test-e2e/actions/dragAndDrop";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
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
      const { groupFaqPage } = organizationPage;

      // Wait for FAQ entries to load completely.
      await page.waitForLoadState("domcontentloaded");

      const faqCount = await groupFaqPage.getFaqCount();

      if (faqCount >= 2) {
        // Get initial order of first 2 FAQ questions for drag and drop test.
        const initialOrder = await getFAQCardOrder(page);
        const firstQuestion = initialOrder[0];
        const secondQuestion = initialOrder[1];

        // Verify drag handles are visible and get their properties.
        const firstFaqDragHandle = groupFaqPage.getFaqDragHandle(0);
        const secondFaqDragHandle = groupFaqPage.getFaqDragHandle(1);

        // Quick validation that drag handles are ready.
        await expect(firstFaqDragHandle).toBeVisible();
        await expect(secondFaqDragHandle).toBeVisible();

        // Validate drag handles have the correct CSS class.
        await expect(firstFaqDragHandle).toContainClass("drag-handle");
        await expect(secondFaqDragHandle).toContainClass("drag-handle");

        // Perform drag and drop using shared utility.
        // NOTE: We use mouse events with delays instead of dragTo() because
        // dragTo() executes too quickly for vuedraggable to process the drag sequence.
        await performDragAndDrop(page, firstFaqDragHandle, secondFaqDragHandle);

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
  }
);
