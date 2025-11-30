// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToOrganizationGroupSubpage(page, "resources");

  // Wait for page to be fully loaded.
  await page.waitForLoadState("domcontentloaded");

  // Wait for the page to be ready and auth state to be hydrated.
  // Check for auth cookie presence as a sign that authentication is working.
  try {
    await page.waitForFunction(() => {
      return document.cookie.includes("auth.token");
    });
  } catch {
    // If auth cookie check fails, verify the page is still accessible.
    // and not showing sign-in page (which would indicate auth failure).
    const currentUrl = page.url();
    if (currentUrl.includes("/auth/sign-in")) {
      throw new Error("Authentication failed - redirected to sign-in page");
    }

    // Log warning but continue - the page might still be functional.
    // eslint-disable-next-line no-console
    console.warn("Auth cookie not found, but page appears to be loaded");
  }

  // Wait intelligently for UI to stabilize (no arbitrary delay).
  await expect(async () => {
    const isReady = await page.evaluate(
      () => document.readyState === "complete"
    );
    expect(isReady).toBe(true);
  }).toPass({
    timeout: 10000,
    intervals: [100, 250],
  });
});

test.describe(
  "Organization Group Resources Page - Display",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // MARK: Accessibility

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

    // MARK: View

    test("User can view group resources", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupResourcesPage } = organizationPage;

      // Wait for resources to load completely.
      await page.waitForLoadState("domcontentloaded");

      // Wait for either resources or empty state to appear.
      await expect(async () => {
        const resourcesListVisible = await groupResourcesPage.resourcesList
          .isVisible()
          .catch(() => false);
        const emptyStateVisible = await groupResourcesPage.emptyState
          .isVisible()
          .catch(() => false);
        expect(resourcesListVisible || emptyStateVisible).toBe(true);
      }).toPass();

      // Check if resources exist or empty state is shown.
      const resourceCount = await groupResourcesPage.getResourceCount();

      if (resourceCount > 0) {
        // Verify resources list is visible.
        await expect(groupResourcesPage.resourcesList).toBeVisible();
        await expect(groupResourcesPage.resourceCards.first()).toBeVisible();

        // Verify first resource has required elements.
        const firstResourceCard = groupResourcesPage.getResourceCard(0);
        await expect(firstResourceCard).toBeVisible();

        const firstResourceLink = groupResourcesPage.getResourceLink(0);
        await expect(firstResourceLink).toBeVisible();
        await expect(firstResourceLink).toHaveAttribute("href", /.+/);

        // Verify resource icon is visible.
        const firstResourceIcon = groupResourcesPage.getResourceIcon(0);
        await expect(firstResourceIcon).toBeVisible();
      } else {
        // Verify empty state is shown when no resources.
        await expect(groupResourcesPage.emptyState).toBeVisible();
        await expect(groupResourcesPage.emptyStateMessage).toBeVisible();
      }
    });

    // MARK: Share

    test("User can share group resources", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupResourcesPage, shareModal } = organizationPage;

      // Wait for resources to load.
      await page.waitForLoadState("domcontentloaded");

      const resourceCount = await groupResourcesPage.getResourceCount();

      if (resourceCount > 0) {
        // Open the tooltip menu for the first resource.
        const menuButton = groupResourcesPage.getResourceMenuButton(0);
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        // Verify tooltip menu appears.
        const menuTooltip = groupResourcesPage.getResourceMenuTooltip(0);
        await expect(menuTooltip).toBeVisible();

        // Verify share button exists and is clickable.
        const shareButton = groupResourcesPage.getResourceShareButton(0);
        await expect(shareButton).toBeVisible();
        await expect(shareButton).toBeEnabled();

        // Click share button to open share modal.
        await shareButton.click();

        // Verify share modal opens.
        await expect(shareModal.modal).toBeVisible();

        // Close the modal using the close button.
        // Use force: true to bypass icon interception.
        const closeButton = shareModal.closeButton(shareModal.modal);
        await closeButton.click({ force: true });
        // Verify modal closes.
        await expect(shareModal.modal).not.toBeVisible();
      } else {
        test.skip(resourceCount > 0, "No resources available to test sharing");
      }
    });
  }
);
