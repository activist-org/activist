// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToFirstOrganization } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToFirstOrganization(page);
});

test.describe("Organization About Page", { tag: "@mobile" }, () => {
  test("User can navigate through organization sections on mobile", async ({
    page,
  }) => {
    const organizationPage = newOrganizationPage(page);
    const { aboutPage, eventsPage } = organizationPage;

    // Verify we start on the About page (mobile auto-redirects to /about).
    await expect(page).toHaveURL(/.*\/organizations\/.*\/about/, {
      timeout: 10000,
    });
    await page.waitForLoadState("domcontentloaded");

    // Organization pages load slowly in dev mode.
    await expect(organizationPage.shareButton).toBeVisible({
      timeout: 15000,
    });
    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to About section using existing component object.
    await organizationPage.menu.aboutOption.click();
    await expect(aboutPage.getInvolvedCard).toBeVisible();

    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to Events section.
    await organizationPage.menu.eventsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/events/);
    await expect(eventsPage.eventsNewButton).toBeVisible();
    await expect(eventsPage.eventsSubscribeButton).toBeVisible();

    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to Resources section.
    await organizationPage.menu.resourcesOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/resources/);

    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to FAQ section.
    await organizationPage.menu.questionsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/faq/);
  });
});
