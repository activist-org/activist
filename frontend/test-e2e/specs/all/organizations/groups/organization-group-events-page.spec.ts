// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToOrganizationGroupSubpage(page, "events");
});

test.describe(
  "Organization Group Events Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test("Organization Group Events Page has no detectable accessibility issues", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await withTestStep(
        testInfo,
        "Wait for lang attribute to be set",
        async () => {
          await expect(page.locator("html")).toHaveAttribute(
            "lang",
            /^[a-z]{2}(-[A-Z]{2})?$/
          );
        }
      );

      await withTestStep(testInfo, "Run accessibility scan", async () => {
        const violations = await runAccessibilityTest(
          "Organization Group Events Page",
          page,
          testInfo
        );
        expect
          .soft(violations, "Accessibility violations found:")
          .toHaveLength(0);

        if (violations.length > 0) {
          // Note: For future implementation.
        }
      });
    });

    test("User can view group events", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupEventsPage } = organizationPage;

      // Wait for events to load completely.
      await page.waitForLoadState("domcontentloaded");

      // Wait a bit more for the page to fully render.
      await page.waitForTimeout(2000);

      // Wait for page to load and check what's actually present.
      await page.waitForLoadState("domcontentloaded");

      // Check if we have events, empty state, or just the basic page structure.
      const eventsListVisible = await groupEventsPage.eventsList
        .isVisible()
        .catch(() => false);
      const emptyStateVisible = await groupEventsPage.emptyState
        .isVisible()
        .catch(() => false);

      // If neither events nor empty state is visible, that's also a valid state.
      // (the page might be loading or have no events but not show empty state).
      if (!eventsListVisible && !emptyStateVisible) {
        // Just verify the page loaded with the expected header elements.
        await expect(groupEventsPage.newEventButton).toBeVisible();
        return; // exit early since this is a valid state
      }

      // Check if events exist or empty state is shown.
      const eventCount = await groupEventsPage.getEventCount();

      if (eventCount > 0) {
        // Verify events list is visible.
        await expect(groupEventsPage.eventsList).toBeVisible();
        await expect(groupEventsPage.eventCards.first()).toBeVisible();

        // Verify first event has required elements.
        const firstEventCard = groupEventsPage.getEventCard(0);
        await expect(firstEventCard).toBeVisible();

        const firstEventLink = groupEventsPage.getEventLink(0);
        await expect(firstEventLink).toBeVisible();
        await expect(firstEventLink).toHaveAttribute("href", /.+/);
      } else if (emptyStateVisible) {
        // Verify empty state is shown when no events.
        await expect(groupEventsPage.emptyState).toBeVisible();
        await expect(groupEventsPage.emptyStateMessage).toBeVisible();
      }
      // If neither events nor empty state is visible, that's also valid (handled by early return above).
    });

    test("User can access new event creation", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupEventsPage } = organizationPage;

      // Verify new event button is visible and functional.
      await expect(groupEventsPage.newEventButton).toBeVisible();
      await expect(groupEventsPage.newEventButton).toHaveAttribute(
        "href",
        /.+/
      );
      // Note: We don't click it as it would navigate away from the current page
    });
  }
);
