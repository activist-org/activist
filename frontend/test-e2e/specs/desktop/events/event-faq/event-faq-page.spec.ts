// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToFirstEvent } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToFirstEvent(page);

  const eventPage = newEventPage(page);

  // Navigate to FAQ page.
  await eventPage.menu.questionsOption.click();
  await expect(page).toHaveURL(/.*\/events\/.*\/faq/);
});

test.describe("Event FAQ Page", { tag: "@desktop" }, () => {
  test("FAQ page displays correctly", async ({ page }) => {
    const eventPage = newEventPage(page);
    const { faqPage } = eventPage;

    // Wait for page to load completely.
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {
      // Network might not go idle, continue anyway.
    });

    // Try to wait for FAQ cards to load (with timeout).
    const faqCardsVisible = await faqPage.faqCards
      .first()
      .isVisible({ timeout: 15000 })
      .catch(() => false);

    if (faqCardsVisible) {
      // If there are FAQs, verify they are visible.
      const faqCount = await faqPage.getFAQCount();
      expect(faqCount).toBeGreaterThan(0);
      await expect(faqPage.getFAQCard(0)).toBeVisible();
    } else {
      // If no FAQs loaded, verify empty state is displayed.
      await expect(faqPage.emptyState).toBeVisible();
    }
  });

  test("User can expand and collapse FAQ items", async ({ page }) => {
    const eventPage = newEventPage(page);
    const { faqPage } = eventPage;

    // Wait for page to load completely.
    await page
      .waitForLoadState("networkidle", { timeout: 15000 })
      .catch(() => {});

    // Wait for FAQ cards to be visible before getting count.
    await faqPage.faqCards
      .first()
      .waitFor({ state: "visible", timeout: 15000 })
      .catch(() => {});

    const faqCount = await faqPage.getFAQCount();

    // Skip test if no FAQs available.
    test.skip(faqCount === 0, "No FAQs available to test");

    if (faqCount > 0) {
      // Check initial state (should be collapsed).
      const initiallyExpanded = await faqPage.isFAQExpanded(0);

      // Expand the first FAQ.
      await faqPage.expandFAQ(0);

      // Verify it's now expanded.
      await expect(faqPage.getFAQAnswer(0)).toBeVisible();
      // Collapse it again.
      await faqPage.collapseFAQ(0);

      // Verify it's collapsed (or check that answer is hidden).
      const isExpanded = await faqPage.isFAQExpanded(0);
      expect(isExpanded).toBe(initiallyExpanded);
    }
  });
});
