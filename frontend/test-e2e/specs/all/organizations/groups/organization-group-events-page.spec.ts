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

    test("Group events page elements are accessible", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const groupEventsPage = organizationPage.groupEventsPage;

      await withTestStep(
        testInfo,
        "Verify new event button is accessible",
        async () => {
          await expect(groupEventsPage.newEventButton).toBeVisible();
          await expect(groupEventsPage.newEventButton).toHaveAttribute(
            "aria-label"
          );
        }
      );

      await withTestStep(
        testInfo,
        "Verify subscribe to events button is accessible",
        async () => {
          await expect(groupEventsPage.subscribeToEventsButton).toBeVisible();
          await expect(groupEventsPage.subscribeToEventsButton).toHaveAttribute(
            "aria-label"
          );
        }
      );

      await withTestStep(
        testInfo,
        "Verify tab navigation is accessible",
        async () => {
          await expect(groupEventsPage.tabs).toBeVisible();
          await expect(groupEventsPage.eventsTab).toHaveAttribute(
            "aria-selected",
            "true"
          );
          await expect(groupEventsPage.aboutTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
          await expect(groupEventsPage.resourcesTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
          await expect(groupEventsPage.faqTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
        }
      );

      await withTestStep(
        testInfo,
        "Verify events content or empty state",
        async () => {
          if (await groupEventsPage.hasEvents()) {
            // If events exist, verify they are accessible
            const eventCount = await groupEventsPage.getEventCount();
            expect(eventCount).toBeGreaterThan(0);

            // Check first event card is accessible
            await expect(groupEventsPage.firstEventCard).toBeVisible();
          } else {
            // If no events, verify empty state is accessible
            await expect(groupEventsPage.emptyState).toBeVisible();
            await expect(groupEventsPage.emptyStateMessage).toBeVisible();
          }
        }
      );
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
