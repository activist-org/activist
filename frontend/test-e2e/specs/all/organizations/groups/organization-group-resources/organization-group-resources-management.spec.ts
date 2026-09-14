// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

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
    // MARK: CRUD Operations

    test("User can manage resources (CREATE, UPDATE, DELETE)", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const { groupResourcesPage } = newOrganizationPage(page);

      await page.waitForLoadState("domcontentloaded");
      await expect(
        groupResourcesPage.resourceCards
          .first()
          .or(groupResourcesPage.emptyState)
      ).toBeVisible({ timeout: 15000 });

      const timestamp = Date.now();
      const name = `Test Resource ${timestamp}`;
      const updatedName = `Updated Resource ${timestamp}`;

      // MARK: Create

      await expect(groupResourcesPage.newResourceButton).toBeVisible();
      await expect(groupResourcesPage.newResourceButton).toBeEnabled();
      await groupResourcesPage.newResourceButton.click();

      const createModal = groupResourcesPage.resourceModal;
      await expect(createModal).toBeVisible();

      await groupResourcesPage.fillResourceForm(
        createModal,
        name,
        `Created by e2e run ${timestamp}.`,
        `https://example.org/${timestamp}`
      );

      // Register the listener before the click so a fast response is not missed.
      const createResponse = page.waitForResponse(
        (res) =>
          res.request().method() === "POST" &&
          new URL(res.url()).pathname.includes("/communities/group_resources"),
        { timeout: 20000 }
      );
      await groupResourcesPage.submitResourceForm(createModal);

      const createRes = await createResponse;
      expect(
        [200, 201].includes(createRes.status()),
        `POST group resource expected 200 or 201, got ${createRes.status()}`
      ).toBe(true);

      await expect(createModal).not.toBeVisible();

      // Assert on this test's own card: the suite runs fullyParallel, so total
      // counts are unreliable.
      const createdCard = groupResourcesPage.resourceCardByName(name);
      await expect(createdCard).toBeVisible();

      const resourceId = await createdCard.getAttribute("data-resource-id");
      expect(resourceId).toBeTruthy();

      // MARK: Update

      await groupResourcesPage.resourceEditButton(createdCard).click();

      const editModal = groupResourcesPage.editResourceModal;
      await expect(editModal).toBeVisible();
      await groupResourcesPage
        .getResourceNameInput(editModal)
        .fill(updatedName);

      // Match this resource's PUT, not a concurrent reorder PUT.
      const updateResponse = page.waitForResponse(
        (res) =>
          res.request().method() === "PUT" &&
          new URL(res.url()).pathname.endsWith(
            `/communities/group_resources/${resourceId}`
          ),
        { timeout: 20000 }
      );
      await groupResourcesPage.submitResourceForm(editModal);

      const updateRes = await updateResponse;
      expect(
        [200, 204].includes(updateRes.status()),
        `PUT group resource expected 200 or 204, got ${updateRes.status()}`
      ).toBe(true);

      await expect(editModal).not.toBeVisible();

      const updatedCard = groupResourcesPage.resourceCardByName(updatedName);
      await expect(updatedCard).toBeVisible();
      await expect(groupResourcesPage.resourceCardByName(name)).toHaveCount(0);

      // MARK: Delete

      await groupResourcesPage.resourceDeleteButton(updatedCard).click();

      const confirmationModal = page.locator("#modal").first();
      await expect(confirmationModal).toBeVisible({ timeout: 15000 });

      // ModalAlert does not await the parent's async delete handler, so the
      // dialog can close before DELETE finishes: wait on the response first.
      const deleteResponse = page.waitForResponse(
        (res) =>
          res.request().method() === "DELETE" &&
          new URL(res.url()).pathname.endsWith(
            `/communities/group_resources/${resourceId}`
          ),
        { timeout: 20000 }
      );
      await confirmationModal
        .getByRole("button", { name: /confirm|yes|delete/i })
        .click();

      const deleteRes = await deleteResponse;
      expect(
        [200, 204].includes(deleteRes.status()),
        `DELETE group resource expected 200 or 204, got ${deleteRes.status()}`
      ).toBe(true);

      await expect(
        groupResourcesPage.resourceCardByName(updatedName)
      ).toHaveCount(0, { timeout: 20000 });
    });
  }
);
