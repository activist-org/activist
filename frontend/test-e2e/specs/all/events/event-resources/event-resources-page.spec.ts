// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToEventSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/test-traceability";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation.
  await navigateToEventSubpage(page, "resources");
});

test.describe("Event Resources Page", { tag: ["@desktop"] }, () => {
  // Note: Check to make sure that this is eventually done for light and dark modes.
  test("Event Resources Page has no detectable accessibility issues", async ({
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
        "Event Resources Page",
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

  test("User can view event resources", async ({ page }) => {
    const eventPage = newEventPage(page);
    const { resourcesPage } = eventPage;

    // Wait for resources to load completely.
    await page.waitForLoadState("domcontentloaded");

    // Wait for either resources or empty state to appear.
    await expect(async () => {
      const resourcesListVisible = await resourcesPage.resourcesList
        .isVisible()
        .catch(() => false);
      const emptyStateVisible = await resourcesPage.emptyState
        .isVisible()
        .catch(() => false);
      expect(resourcesListVisible || emptyStateVisible).toBe(true);
    }).toPass();

    // Check if resources exist or empty state is shown.
    const resourceCount = await resourcesPage.getResourceCount();

    if (resourceCount > 0) {
      // Verify resources list is visible.
      await expect(resourcesPage.resourcesList).toBeVisible();
      await expect(resourcesPage.resourceCards.first()).toBeVisible();

      // Verify first resource has required elements.
      const firstResourceCard = resourcesPage.getResourceCard(0);
      await expect(firstResourceCard).toBeVisible();

      const firstResourceLink = resourcesPage.getResourceLink(0);
      await expect(firstResourceLink).toBeVisible();
      await expect(firstResourceLink).toHaveAttribute("href", /.+/);

      // Verify resource icon is visible.
      const firstResourceIcon = resourcesPage.getResourceIcon(0);
      await expect(firstResourceIcon).toBeVisible();
    } else {
      // Verify empty state is shown when no resources.
      await expect(resourcesPage.emptyState).toBeVisible();
      await expect(resourcesPage.emptyStateMessage).toBeVisible();
    }
  });

  // MARK: CRUD Operations

  test("User can manage resources (CREATE, UPDATE, DELETE)", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const { resourcesPage } = newEventPage(page);

    await page.waitForLoadState("domcontentloaded");
    await expect(
      resourcesPage.resourceCards.first().or(resourcesPage.emptyState)
    ).toBeVisible({ timeout: 15000 });

    const timestamp = Date.now();
    const name = `Test Resource ${timestamp}`;
    const updatedName = `Updated Resource ${timestamp}`;

    // MARK: Create

    await expect(resourcesPage.newResourceButton).toBeVisible();
    await expect(resourcesPage.newResourceButton).toBeEnabled();
    await resourcesPage.newResourceButton.click();

    const createModal = resourcesPage.resourceModal;
    await expect(createModal).toBeVisible();

    await resourcesPage.resourceNameInput(createModal).fill(name);
    await resourcesPage
      .resourceDescriptionInput(createModal)
      .fill(`Created by e2e run ${timestamp}.`);
    await resourcesPage
      .resourceUrlInput(createModal)
      .fill(`https://example.org/${timestamp}`);

    // Register the listener before the click so a fast response is not missed.
    const createResponse = page.waitForResponse(
      (res) =>
        res.request().method() === "POST" &&
        new URL(res.url()).pathname.includes("/events/event_resources"),
      { timeout: 20000 }
    );
    await resourcesPage.resourceSubmitButton(createModal).click();

    const createRes = await createResponse;
    expect(
      [200, 201].includes(createRes.status()),
      `POST event resource expected 200 or 201, got ${createRes.status()}`
    ).toBe(true);

    await expect(createModal).not.toBeVisible();

    // Assert on this test's own card: the suite runs fullyParallel, so total
    // counts are unreliable.
    const createdCard = resourcesPage.resourceCardByName(name);
    await expect(createdCard).toBeVisible();

    const resourceId = await createdCard.getAttribute("data-resource-id");
    expect(resourceId).toBeTruthy();

    // MARK: Update

    await resourcesPage.resourceEditButton(createdCard).click();

    const editModal = resourcesPage.editResourceModal;
    await expect(editModal).toBeVisible();
    await resourcesPage.resourceNameInput(editModal).fill(updatedName);

    // Match this resource's PUT, not a concurrent reorder PUT.
    const updateResponse = page.waitForResponse(
      (res) =>
        res.request().method() === "PUT" &&
        new URL(res.url()).pathname.endsWith(
          `/events/event_resources/${resourceId}`
        ),
      { timeout: 20000 }
    );
    await resourcesPage.resourceSubmitButton(editModal).click();

    const updateRes = await updateResponse;
    expect(
      [200, 204].includes(updateRes.status()),
      `PUT event resource expected 200 or 204, got ${updateRes.status()}`
    ).toBe(true);

    await expect(editModal).not.toBeVisible();

    const updatedCard = resourcesPage.resourceCardByName(updatedName);
    await expect(updatedCard).toBeVisible();
    await expect(resourcesPage.resourceCardByName(name)).toHaveCount(0);

    // MARK: Delete

    await resourcesPage.resourceDeleteButton(updatedCard).click();

    const confirmationModal = page.locator("#modal").first();
    await expect(confirmationModal).toBeVisible({ timeout: 15000 });

    // ModalAlert does not await the parent's async delete handler, so the
    // dialog can close before DELETE finishes: wait on the response first.
    const deleteResponse = page.waitForResponse(
      (res) =>
        res.request().method() === "DELETE" &&
        new URL(res.url()).pathname.endsWith(
          `/events/event_resources/${resourceId}`
        ),
      { timeout: 20000 }
    );
    await confirmationModal
      .getByRole("button", { name: /confirm|yes|delete/i })
      .click();

    const deleteRes = await deleteResponse;
    expect(
      [200, 204].includes(deleteRes.status()),
      `DELETE event resource expected 200 or 204, got ${deleteRes.status()}`
    ).toBe(true);

    await expect(resourcesPage.resourceCardByName(updatedName)).toHaveCount(0, {
      timeout: 20000,
    });
  });
});
