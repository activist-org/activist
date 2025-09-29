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
  // Navigate to a group resources page within an organization
  await navigateToOrganizationGroupSubpage(page, "resources");
});

test.describe(
  "Organization Group Resources Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test("Organization Group Resources Page has no detectable accessibility issues", async ({
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
          "Organization Group Resources Page",
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

    test("Group resources page elements are accessible", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const groupResourcesPage = organizationPage.groupResourcesPage;

      await withTestStep(
        testInfo,
        "Verify new resource button is accessible",
        async () => {
          await expect(groupResourcesPage.newResourceButton).toBeVisible();
          await expect(groupResourcesPage.newResourceButton).toHaveAttribute(
            "aria-label"
          );
        }
      );

      await withTestStep(
        testInfo,
        "Verify tab navigation is accessible",
        async () => {
          await expect(groupResourcesPage.tabs).toBeVisible();
          await expect(groupResourcesPage.resourcesTab).toHaveAttribute(
            "aria-selected",
            "true"
          );
          await expect(groupResourcesPage.aboutTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
          await expect(groupResourcesPage.eventsTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
          await expect(groupResourcesPage.faqTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
        }
      );

      await withTestStep(
        testInfo,
        "Verify resources content or empty state",
        async () => {
          if (await groupResourcesPage.hasResources()) {
            // If resources exist, verify they are accessible
            const resourceCount = await groupResourcesPage.getResourceCount();
            expect(resourceCount).toBeGreaterThan(0);

            // Check first resource card is accessible
            await expect(groupResourcesPage.firstResourceCard).toBeVisible();

            // Verify resource links are accessible
            const resourceLink = groupResourcesPage.getResourceLink(0);
            await expect(resourceLink).toBeVisible();
            await expect(resourceLink).toHaveAttribute("href");
          } else {
            // If no resources, verify empty state is accessible
            await expect(groupResourcesPage.emptyState).toBeVisible();
            await expect(groupResourcesPage.emptyStateMessage).toBeVisible();
          }
        }
      );
    });

    test("Group resources page tab navigation works correctly", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const groupResourcesPage = organizationPage.groupResourcesPage;

      await withTestStep(testInfo, "Navigate to about tab", async () => {
        await groupResourcesPage.clickAboutTab();
        await expect(groupResourcesPage.aboutTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupResourcesPage.resourcesTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Navigate to events tab", async () => {
        await groupResourcesPage.clickEventsTab();
        await expect(groupResourcesPage.eventsTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupResourcesPage.aboutTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Navigate to FAQ tab", async () => {
        await groupResourcesPage.clickFaqTab();
        await expect(groupResourcesPage.faqTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupResourcesPage.eventsTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Return to resources tab", async () => {
        await groupResourcesPage.clickResourcesTab();
        await expect(groupResourcesPage.resourcesTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupResourcesPage.faqTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });
    });

    test("Group resources page resource links are accessible", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const groupResourcesPage = organizationPage.groupResourcesPage;

      // Only test if resources exist
      if (await groupResourcesPage.hasResources()) {
        await withTestStep(
          testInfo,
          "Verify resource links have proper attributes",
          async () => {
            const resourceCount = await groupResourcesPage.getResourceCount();

            for (let i = 0; i < Math.min(resourceCount, 3); i++) {
              const resourceLink = groupResourcesPage.getResourceLink(i);
              const resourceTitle = groupResourcesPage.getResourceTitle(i);

              await expect(resourceLink).toBeVisible();
              await expect(resourceLink).toHaveAttribute("href");

              // Verify resource title is accessible
              await expect(resourceTitle).toBeVisible();
              const titleText = await resourceTitle.textContent();
              expect(titleText).toBeTruthy();
            }
          }
        );
      }
    });
  }
);
