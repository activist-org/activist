// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  await navigateToOrganizationGroupSubpage(page, "resources");

  try {
    await page.waitForFunction(
      () => document.cookie.includes("auth.token"),
      { timeout: 3000 }
    );
  } catch {
    const currentUrl = page.url();
    if (currentUrl.includes("/auth/sign-in")) {
      throw new Error("Authentication failed - redirected to sign-in page");
    }
  }

  await expect(async () => {
    const isReady = await page.evaluate(
      () => document.readyState === "complete"
    );
    expect(isReady).toBe(true);
  }).toPass({ timeout: 3000, intervals: [100, 250] });
});

test.describe(
  "Organization Group Resources Page - Management",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // MARK: Create

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

    // MARK: Edit

    test("User can edit group resources", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupResourcesPage } = organizationPage;

      const resourceCount = await groupResourcesPage.getResourceCount();

      if (resourceCount > 0) {
        // Note: Check auth state.
        const cookies = await page.context().cookies();
        const authCookie = cookies.find(
          (c) => c.name === "nuxt-session" && c.value
        );

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
        await expect(groupResourcesPage.getResourceEditButton(0)).toBeVisible(
          {}
        );

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
