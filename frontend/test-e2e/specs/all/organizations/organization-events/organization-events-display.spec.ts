// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation.
  await navigateToOrganizationSubpage(page, "events");
});

test.describe(
  "Organization Events Page - Display",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // MARK: ACCESSIBILITY

    // Note: Check to make sure that this is eventually done for light and dark modes.
    test("Organization Events Page has no detectable accessibility issues", async ({
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
          "Organization Events Page",
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

    // MARK: VIEW EVENTS

    test("User can view organization events", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const { eventsPage } = organizationPage;

      // Wait for events to load completely.
      await page.waitForLoadState("domcontentloaded");

      // Wait for either events or empty state to appear.
      await expect(async () => {
        const eventsListVisible = await eventsPage.eventsList
          .isVisible()
          .catch(() => false);
        const emptyStateVisible = await eventsPage.emptyState
          .isVisible()
          .catch(() => false);
        expect(eventsListVisible || emptyStateVisible).toBe(true);
      }).toPass();

      // Check if events exist or empty state is shown.
      const eventCount = await eventsPage.getEventCount();

      if (eventCount > 0) {
        // Verify events list is visible.
        await expect(eventsPage.eventsList).toBeVisible();
        await expect(eventsPage.eventCards.first()).toBeVisible();

        // Verify first event has required elements.
        const firstEventCard = eventsPage.getEventCard(0);
        await expect(firstEventCard).toBeVisible();

        const firstEventLink = eventsPage.getEventLink(0);
        await expect(firstEventLink).toBeVisible();
        await expect(firstEventLink).toHaveAttribute("href", /.+/);
      } else {
        // Verify empty state is shown when no events.
        await expect(eventsPage.emptyState).toBeVisible();
        await expect(eventsPage.emptyStateMessage).toBeVisible();
      }
    });

    // MARK: NAVIGATION

    test("User can navigate to individual events", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const { eventsPage } = organizationPage;

      // Wait for events to load completely.
      await page.waitForLoadState("domcontentloaded");

      const eventCount = await eventsPage.getEventCount();

      if (eventCount > 0) {
        // Get the first event link URL before clicking.
        const firstEventLink = eventsPage.getEventLink(0);
        const eventUrl = await firstEventLink.getAttribute("href");

        expect(eventUrl).toBeTruthy();
        expect(eventUrl).toMatch(/\/events\/.+/);

        // Click the event to navigate to it.
        await eventsPage.navigateToEvent(0);
        // Verify we navigated to the event page.
        await expect(page).toHaveURL(new RegExp(eventUrl!));
      } else {
        // Skip test if no events are available.
        test.skip(eventCount > 0, "No events available to test navigation");
      }
    });
  }
);
