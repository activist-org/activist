// SPDX-License-Identifier: AGPL-3.0-or-later
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

      await withTestStep(
        testInfo,
        "New resource button is visible and enabled",
        async () => {
          await expect(groupResourcesPage.newResourceButton).toBeVisible();
          await expect(groupResourcesPage.newResourceButton).toBeEnabled();
        }
      );

      await withTestStep(testInfo, "Open create modal and close", async () => {
        await groupResourcesPage.newResourceButton.click();
        await expect(groupResourcesPage.resourceModal).toBeVisible();
        await expect(groupResourcesPage.resourceModalCloseButton).toBeVisible();
        await groupResourcesPage.resourceModalCloseButton.click();
        await expect(groupResourcesPage.resourceModal).not.toBeVisible();
      });
    });

    // MARK: Edit

    test("User can edit group resources", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupResourcesPage } = organizationPage;

      await page.waitForLoadState("domcontentloaded");

      const resourceCount = await groupResourcesPage.getResourceCount();

      if (resourceCount > 0) {
        const timestamp = Date.now();
        const newName = `Test Group Resource ${timestamp}`;
        const newDescription = `Updated group resource description ${timestamp}`;
        const newUrl = `https://test-group-resource-${timestamp}.com`;

        const editResourceModal = await withTestStep(
          testInfo,
          "Open edit modal for first resource",
          async () => {
            const cookies = await page.context().cookies();
            const authCookie = cookies.find(
              (c) => c.name === "nuxt-session" && c.value
            );

            if (!authCookie) {
              throw new Error(
                "No auth token found - global authentication not working"
              );
            }

            const editButtonCount = await groupResourcesPage
              .getResourceEditButton(0)
              .count();

            if (editButtonCount === 0) {
              throw new Error(
                `Edit button not found despite having auth token. Auth cookie present: ${!!authCookie}`
              );
            }

            const firstResourceCard = groupResourcesPage.getResourceCard(0);
            const resourceId =
              await firstResourceCard.getAttribute("data-resource-id");

            if (!resourceId) {
              throw new Error("Resource ID not found on card");
            }

            await expect(groupResourcesPage.getResourceEditButton(0)).toBeVisible(
              {}
            );

            await groupResourcesPage.clickResourceEdit(0);

            const modal = page.getByTestId(
              `modal-ModalResourceGroup${resourceId}`
            );
            await expect(modal).toBeVisible();
            return modal;
          }
        );

        await withTestStep(testInfo, "Fill edit form and submit", async () => {
          const nameInput =
            groupResourcesPage.getResourceNameInput(editResourceModal);
          const descriptionInput =
            groupResourcesPage.getResourceDescriptionInput(editResourceModal);
          const urlInput =
            groupResourcesPage.getResourceUrlInput(editResourceModal);

          await expect(nameInput).toBeVisible();
          await expect(descriptionInput).toBeVisible();
          await expect(urlInput).toBeVisible();

          await nameInput.clear();
          await nameInput.fill(newName);

          await descriptionInput.clear();
          await descriptionInput.fill(newDescription);

          await urlInput.clear();
          await urlInput.fill(newUrl);

          await expect(nameInput).toHaveValue(newName);
          await expect(descriptionInput).toHaveValue(newDescription);
          await expect(urlInput).toHaveValue(newUrl);

          const submitButton =
            groupResourcesPage.getResourceSubmitButton(editResourceModal);
          await expect(submitButton).toBeVisible();
          await submitButton.click();

          await expect(editResourceModal).not.toBeVisible();
        });

        await withTestStep(testInfo, "Assert card shows updated name", async () => {
          const resourceCard = groupResourcesPage.getResourceCard(0);
          await expect(resourceCard).toContainText(newName);
        });
      } else {
        test.skip(resourceCount > 0, "No resources available to test editing");
      }
    });
  }
);
