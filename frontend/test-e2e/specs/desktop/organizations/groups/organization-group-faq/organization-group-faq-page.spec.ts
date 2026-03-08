// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  getFAQCardOrder,
  performDragAndDrop,
  verifyReorder,
} from "~/test-e2e/actions/dragAndDrop";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { ensureMinimumFAQs } from "~/test-e2e/utils/faqHelpers";

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

      // Ensure we have at least 2 FAQs for testing (create them if needed).
      const faqCount = await ensureMinimumFAQs(page, groupFaqPage, 2);

      // Verify we have at least 2 FAQs.
      expect(faqCount).toBeGreaterThanOrEqual(2);

      // Get initial order of first 2 FAQ questions for drag and drop test.
      const initialOrder = await getFAQCardOrder(page);
      const firstQuestion = initialOrder[0];
      const secondQuestion = initialOrder[1];

      // Verify drag handles are visible.
      const firstFaqDragHandle = groupFaqPage.getFaqDragHandle(0);
      const secondFaqDragHandle = groupFaqPage.getFaqDragHandle(1);

      await expect(firstFaqDragHandle).toBeVisible();
      await expect(secondFaqDragHandle).toBeVisible();

      // Validate drag handles have the correct CSS class.
      await expect(firstFaqDragHandle).toContainClass("drag-handle");
      await expect(secondFaqDragHandle).toContainClass("drag-handle");

      // Perform drag and drop using shared utility.
      await performDragAndDrop(page, firstFaqDragHandle, secondFaqDragHandle);

      // Verify the reorder using shared utility.
      await verifyReorder(
        page,
        firstQuestion ?? "",
        secondQuestion ?? "",
        getFAQCardOrder
      );
    });
  }
);
