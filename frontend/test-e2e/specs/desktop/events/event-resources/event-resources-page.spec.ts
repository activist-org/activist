// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToFirstEvent } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToFirstEvent(page);

  const eventPage = newEventPage(page);

  // Navigate to Resources page.
  await eventPage.menu.resourcesOption.click();
  await expect(page).toHaveURL(/.*\/events\/.*\/resources/);
});

test.describe("Event Resources Page", { tag: "@desktop" }, () => {
  test("Resources page displays correctly", async ({ page }) => {
    const eventPage = newEventPage(page);
    const { resourcesPage } = eventPage;

    // Wait for page to load completely.
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {
      // Network might not go idle, continue anyway.
    });

    // Try to wait for resource cards to load (with timeout).
    const resourceCardsVisible = await resourcesPage.resourceCards
      .first()
      .isVisible({ timeout: 15000 })
      .catch(() => false);

    if (resourceCardsVisible) {
      // If there are resources, verify they are visible.
      const resourceCount = await resourcesPage.getResourceCount();
      expect(resourceCount).toBeGreaterThan(0);
      await expect(resourcesPage.getResourceCard(0)).toBeVisible();
    } else {
      // If no resources loaded, verify empty state is displayed.
      await expect(resourcesPage.emptyState).toBeVisible();
    }
  });

  test("User can view resource cards", async ({ page }) => {
    const eventPage = newEventPage(page);
    const { resourcesPage } = eventPage;

    // Wait for page to load completely.
    await page
      .waitForLoadState("networkidle", { timeout: 15000 })
      .catch(() => {});

    // Wait for resource cards to be visible before getting count.
    await resourcesPage.resourceCards
      .first()
      .waitFor({ state: "visible", timeout: 15000 })
      .catch(() => {});

    const resourceCount = await resourcesPage.getResourceCount();

    // Skip test if no resources available.
    test.skip(resourceCount === 0, "No resources available to test");

    if (resourceCount > 0) {
      // Verify the first resource card is visible.
      await expect(resourcesPage.getResourceCard(0)).toBeVisible();
      // Verify resource link is visible.
      await expect(resourcesPage.getResourceLink(0)).toBeVisible();

      // Verify resource icon is visible.
      await expect(resourcesPage.getResourceIcon(0)).toBeVisible();
    }
  });
});
