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
    await page.waitForFunction(
      () => {
        return document.cookie.includes("auth.token");
      },
      { timeout: 15000 }
    );
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
    timeout: 2000,
    intervals: [100, 250],
  });
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
      }).toPass({ timeout: 10000 });

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

    test("User can access new resource creation", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupResourcesPage } = organizationPage;

      // Verify new resource button is visible and functional.
      await expect(groupResourcesPage.newResourceButton).toBeVisible();
      await expect(groupResourcesPage.newResourceButton).toBeEnabled();

      // Click the new resource button to open modal.
      await groupResourcesPage.newResourceButton.click();

      // Verify resource creation modal opens.
      await expect(groupResourcesPage.resourceModal).toBeVisible();

      // Close the modal using the close button.
      await expect(groupResourcesPage.resourceModalCloseButton).toBeVisible();
      await groupResourcesPage.resourceModalCloseButton.click();

      // Verify modal closes.
      await expect(groupResourcesPage.resourceModal).not.toBeVisible();
    });

    test("User can share group resources", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupResourcesPage } = organizationPage;

      // Wait for resources to load.
      await page.waitForLoadState("domcontentloaded");

      const resourceCount = await groupResourcesPage.getResourceCount();

      if (resourceCount > 0) {
        // Click on the menu button for the first resource.
        await groupResourcesPage.clickResourceMenu(0);

        // Wait for the tooltip menu to appear.
        await expect(
          groupResourcesPage.getResourceMenuTooltip(0)
        ).toBeVisible();

        // Click the share button.
        await groupResourcesPage.clickResourceShare(0);

        // Wait intelligently for modal to appear (no arbitrary delay).
        await expect(async () => {
          const modalVisible = await page
            .locator('[role="dialog"]')
            .or(page.locator('[id="modal"]'))
            .isVisible()
            .catch(() => false);
          expect(modalVisible).toBe(true);
        }).toPass({
          timeout: 3000,
          intervals: [100, 250, 500],
        });

        // Close any open modals by pressing Escape.
        await page.keyboard.press("Escape");
      } else {
        test.skip(resourceCount > 0, "No resources available to test sharing");
      }
    });

    test("User can edit group resources", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupResourcesPage } = organizationPage;

      // Wait for resources to load.
      await page.waitForLoadState("domcontentloaded");

      const resourceCount = await groupResourcesPage.getResourceCount();

      if (resourceCount > 0) {
        // Note: Check auth state.
        const cookies = await page.context().cookies();
        const authCookie = cookies.find((c) => c.name === "auth.token");

        if (!authCookie) {
          throw new Error(
            "No auth token found - global authentication not working"
          );
        }

        // Check if edit button exists (requires auth).
        const editButtonCount = await groupResourcesPage
          .getResourceEditButton(0)
          .count();

        if (editButtonCount === 0) {
          throw new Error(
            `Edit button not found despite having auth token. Auth cookie present: ${!!authCookie}`
          );
        }

        // Get the resource ID from the first resource card.
        const firstResourceCard = groupResourcesPage.getResourceCard(0);
        const resourceId =
          await firstResourceCard.getAttribute("data-resource-id");

        if (!resourceId) {
          throw new Error("Resource ID not found on card");
        }

        // Wait for edit button to be visible and clickable.
        await expect(groupResourcesPage.getResourceEditButton(0)).toBeVisible({
          timeout: 10000,
        });

        // Click the edit button for the first resource.
        await groupResourcesPage.clickResourceEdit(0);

        // Wait for modal to open with exact testid (includes resource ID).
        const editResourceModal = page.getByTestId(
          `modal-ModalResourceGroup${resourceId}`
        );
        await expect(editResourceModal).toBeVisible();

        // Generate unique content for this test run.
        const timestamp = Date.now();
        const newName = `Test Group Resource ${timestamp}`;
        const newDescription = `Updated group resource description ${timestamp}`;
        const newUrl = `https://test-group-resource-${timestamp}.com`;

        // Update the form fields.
        const nameInput =
          groupResourcesPage.getResourceNameInput(editResourceModal);
        const descriptionInput =
          groupResourcesPage.getResourceDescriptionInput(editResourceModal);
        const urlInput =
          groupResourcesPage.getResourceUrlInput(editResourceModal);

        await expect(nameInput).toBeVisible();
        await expect(descriptionInput).toBeVisible();
        await expect(urlInput).toBeVisible();

        // Clear and fill the form fields.
        await nameInput.clear();
        await nameInput.fill(newName);

        await descriptionInput.clear();
        await descriptionInput.fill(newDescription);

        await urlInput.clear();
        await urlInput.fill(newUrl);

        // Verify the fields contain the new values.
        await expect(nameInput).toHaveValue(newName);
        await expect(descriptionInput).toHaveValue(newDescription);
        await expect(urlInput).toHaveValue(newUrl);

        // Submit the form.
        const submitButton =
          groupResourcesPage.getResourceSubmitButton(editResourceModal);
        await expect(submitButton).toBeVisible();
        await submitButton.click();

        // Wait for the modal to close after successful save.
        await expect(editResourceModal).not.toBeVisible();

        // Verify the changes are reflected on the page.
        // The resource name should be visible in the resource card.
        const resourceCard = groupResourcesPage.getResourceCard(0);
        await expect(resourceCard).toContainText(newName);
      } else {
        test.skip(resourceCount > 0, "No resources available to test editing");
      }
    });
  }
);
