// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation
  await navigateToOrganizationSubpage(page, "events");
});

test.describe(
  "Organization Events Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
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

    test("User can view organization events", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const eventsPage = organizationPage.eventsPage;

      // Wait for events to load completely
      await page.waitForLoadState("networkidle");

      // Wait for either events or empty state to appear
      await expect(async () => {
        const eventsListVisible = await eventsPage.eventsList
          .isVisible()
          .catch(() => false);
        const emptyStateVisible = await eventsPage.emptyState
          .isVisible()
          .catch(() => false);
        expect(eventsListVisible || emptyStateVisible).toBe(true);
      }).toPass({ timeout: 10000 });

      // Check if events exist or empty state is shown
      const eventCount = await eventsPage.getEventCount();

      if (eventCount > 0) {
        // Verify events list is visible
        await expect(eventsPage.eventsList).toBeVisible();
        await expect(eventsPage.eventCards.first()).toBeVisible();

        // Verify first event has required elements
        const firstEventCard = eventsPage.getEventCard(0);
        await expect(firstEventCard).toBeVisible();

        const firstEventLink = eventsPage.getEventLink(0);
        await expect(firstEventLink).toBeVisible();
        await expect(firstEventLink).toHaveAttribute("href", /.+/);
      } else {
        // Verify empty state is shown when no events
        await expect(eventsPage.emptyState).toBeVisible();
        await expect(eventsPage.emptyStateMessage).toBeVisible();
      }
    });

    test("User can access new event creation", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const eventsPage = organizationPage.eventsPage;

      // Verify new event button is visible and functional
      await expect(eventsPage.eventsNewButton).toBeVisible();
      await expect(eventsPage.eventsNewButton).toHaveAttribute("href", /.+/);

      // Note: We don't click it as it would navigate away from the current page
      // and we want to keep the test focused on the events page functionality
    });

    test("User can access events subscription", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const eventsPage = organizationPage.eventsPage;

      // Verify subscribe button is visible and clickable
      await expect(eventsPage.eventsSubscribeButton).toBeVisible();
      await expect(eventsPage.eventsSubscribeButton).toBeEnabled();

      // Click the subscribe button (this should trigger calendar download)
      await eventsPage.eventsSubscribeButton.click();

      // Note: The actual download functionality is handled by the browser
      // and testing file downloads requires special configuration
    });

    test("User can navigate to individual events", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const eventsPage = organizationPage.eventsPage;

      // Wait for events to load completely
      await page.waitForLoadState("networkidle");

      const eventCount = await eventsPage.getEventCount();

      if (eventCount > 0) {
        // Get the first event link URL before clicking
        const firstEventLink = eventsPage.getEventLink(0);
        const eventUrl = await firstEventLink.getAttribute("href");

        expect(eventUrl).toBeTruthy();
        expect(eventUrl).toMatch(/\/events\/.+/);

        // Click the event to navigate to it
        await eventsPage.navigateToEvent(0);

        // Verify we navigated to the event page
        await expect(page).toHaveURL(new RegExp(eventUrl!));
      } else {
        // Skip test if no events are available
        test.skip(eventCount > 0, "No events available to test navigation");
      }
    });

    test("User can share the organization event", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const eventsPage = organizationPage.eventsPage;

      const eventCount = await eventsPage.getEventCount();

      if (eventCount > 0) {
        // Open the tooltip menu for the first event
        const menuButton = eventsPage.getEventMenuButton(0);
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        // Verify tooltip menu appears
        const menuTooltip = eventsPage.getEventMenuTooltip(0);
        await expect(menuTooltip).toBeVisible();

        // Verify share button exists and is clickable
        const shareButton = eventsPage.getEventShareButton(0);
        await expect(shareButton).toBeVisible();
        await expect(shareButton).toBeEnabled();

        // Click share button to open share modal
        await shareButton.click();

        // Verify share modal opens
        await expect(organizationPage.shareModal.modal).toBeVisible();

        // Close the modal
        const closeButton = organizationPage.shareModal.closeButton(
          organizationPage.shareModal.modal
        );
        await expect(closeButton).toBeVisible();
        await closeButton.click();

        // Verify modal closes
        await expect(organizationPage.shareModal.modal).not.toBeVisible();
      } else {
        // Skip test if no events are available
        test.skip(eventCount > 0, "No events available to test sharing");
      }
    });

    test("User can access subscribe button in tooltip menu", async ({
      page,
    }) => {
      const organizationPage = newOrganizationPage(page);
      const eventsPage = organizationPage.eventsPage;

      const eventCount = await eventsPage.getEventCount();

      if (eventCount > 0) {
        // Open the tooltip menu for the first event
        const menuButton = eventsPage.getEventMenuButton(0);
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        // Verify tooltip menu appears
        const menuTooltip = eventsPage.getEventMenuTooltip(0);
        await expect(menuTooltip).toBeVisible();

        // Verify subscribe button exists and is clickable
        const subscribeButton = eventsPage.getEventSubscribeButton(0);
        await expect(subscribeButton).toBeVisible();
        await expect(subscribeButton).toBeEnabled();

        // Click subscribe button (this should trigger calendar download)
        await subscribeButton.click();

        // Note: The actual download functionality is handled by the browser
        // and testing file downloads requires special configuration
        // We just verify the button is functional and clickable
      } else {
        // Skip test if no events are available
        test.skip(eventCount > 0, "No events available to test subscription");
      }
    });
  }
);
