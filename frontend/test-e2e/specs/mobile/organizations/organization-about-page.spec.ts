import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import { navigateToFirstOrganization } from "~/test-e2e/actions/navigation";
// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

test.beforeEach(async ({ page }) => {
  await signInAsAdmin(page);
  await navigateToFirstOrganization(page);
});

test.describe("Organization About Page", { tag: "@mobile" }, () => {
  test("User can navigate through organization sections on mobile", async ({
    page,
  }) => {
    const organizationPage = newOrganizationPage(page);

    // Verify we start on the About page (mobile auto-redirects to /about)
    await expect(page).toHaveURL(/.*\/organizations\/.*\/about/, {
      timeout: 10000,
    });
    await page.waitForLoadState("networkidle", { timeout: 20000 });

    // Organization pages load slowly in dev mode
    await expect(organizationPage.shareButton).toBeVisible({
      timeout: 15000,
    });
    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to About section using existing component object
    await organizationPage.menu.aboutOption.click();
    await expect(organizationPage.aboutPage.getInvolvedCard).toBeVisible();

    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to Events section
    await organizationPage.menu.eventsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/events/);
    await expect(organizationPage.eventsPage.eventsNewButton).toBeVisible();
    await expect(
      organizationPage.eventsPage.eventsSubscribeButton
    ).toBeVisible();

    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to Resources section
    await organizationPage.menu.resourcesOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/resources/);

    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to FAQ section
    await organizationPage.menu.questionsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/faq/);
  });
});
