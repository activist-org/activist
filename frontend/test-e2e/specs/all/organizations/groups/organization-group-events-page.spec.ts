// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Sign in as admin to access edit functionality
  await signInAsAdmin(page);
  // Navigate to a group events page within an organization
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
      const groupEventsPage = organizationPage.groupEventsPage;

      // Wait for events to load completely
      await page.waitForLoadState("networkidle");

      // Wait for either events or empty state to appear
      await expect(async () => {
        const eventsListVisible = await groupEventsPage.eventsList
          .isVisible()
          .catch(() => false);
        const emptyStateVisible = await groupEventsPage.emptyState
          .isVisible()
          .catch(() => false);
        expect(eventsListVisible || emptyStateVisible).toBe(true);
      }).toPass({ timeout: 10000 });

      // Check if events exist or empty state is shown
      const eventCount = await groupEventsPage.getEventCount();

      if (eventCount > 0) {
        // Verify events list is visible
        await expect(groupEventsPage.eventsList).toBeVisible();
        await expect(groupEventsPage.eventCards.first()).toBeVisible();

        // Verify first event has required elements
        const firstEventCard = groupEventsPage.getEventCard(0);
        await expect(firstEventCard).toBeVisible();

        const firstEventLink = groupEventsPage.getEventLink(0);
        await expect(firstEventLink).toBeVisible();
        await expect(firstEventLink).toHaveAttribute("href", /.+/);
      } else {
        // Verify empty state is shown when no events
        await expect(groupEventsPage.emptyState).toBeVisible();
        await expect(groupEventsPage.emptyStateMessage).toBeVisible();
      }
    });

    test("User can access new event creation", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupEventsPage = organizationPage.groupEventsPage;

      // Verify new event button is visible and functional
      await expect(groupEventsPage.newEventButton).toBeVisible();
      await expect(groupEventsPage.newEventButton).toHaveAttribute(
        "href",
        /.+/
      );

      // Note: We don't click it as it would navigate away from the current page
    });

    test("Group events page tab navigation works correctly", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const groupEventsPage = organizationPage.groupEventsPage;

      await withTestStep(testInfo, "Navigate to about tab", async () => {
        await groupEventsPage.clickAboutTab();
        await expect(groupEventsPage.aboutTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupEventsPage.eventsTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Navigate to resources tab", async () => {
        await groupEventsPage.clickResourcesTab();
        await expect(groupEventsPage.resourcesTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupEventsPage.aboutTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Navigate to FAQ tab", async () => {
        await groupEventsPage.clickFaqTab();
        await expect(groupEventsPage.faqTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupEventsPage.resourcesTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Return to events tab", async () => {
        await groupEventsPage.clickEventsTab();
        await expect(groupEventsPage.eventsTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupEventsPage.faqTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });
    });
  }
);
