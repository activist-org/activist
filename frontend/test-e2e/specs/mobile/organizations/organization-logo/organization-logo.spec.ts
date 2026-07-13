// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

test.describe("Organization Logo Shortcut - Mobile", { tag: "@mobile" }, () => {
  test.beforeEach(async ({ page }) => {
    // Landing on a subpage (not the entity root) is required for the
    // shortcut to render, and the org submenu navigation works on mobile.
    await navigateToOrganizationSubpage(page, "about");
    await page.waitForLoadState("domcontentloaded");
  });

  test("shows the entity logo card on a mobile organization subpage", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const logoCard = page.getByTestId("entity-logo-mobile");
    await expect(logoCard).toBeVisible();
    await expect(logoCard).not.toBeEmpty();
  });

  test("opens the image upload modal from the mobile logo edit shortcut", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    // Tests run authenticated as admin, so the edit shortcut is rendered.
    const editButton = page.getByTestId("entity-logo-mobile-edit");
    await expect(editButton).toBeVisible();

    await editButton.click();

    const uploadModal = page.getByTestId("modal-ModalUploadImageIcon");
    await expect(uploadModal).toBeVisible();

    await page.getByTestId("modal-close-button").first().click();
    await expect(uploadModal).not.toBeVisible();
  });
});
