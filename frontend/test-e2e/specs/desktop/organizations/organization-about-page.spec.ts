// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToFirstOrganization } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToFirstOrganization(page);
});

test.describe("Organization About Page", { tag: "@desktop" }, () => {
  test("User can navigate through organization sections on desktop", async ({
    page,
  }) => {
    const organizationPage = newOrganizationPage(page);

    // Ensure sidebar is open for navigation.
    await organizationPage.sidebar.open();

    // Verify we start on the About page (desktop auto-redirects to /about).
    await expect(page).toHaveURL(/.*\/organizations\/.*\/about/, {
      timeout: 10000,
    });
    await page.waitForLoadState("domcontentloaded");

    // Organization pages load slowly in dev mode.
    await expect(organizationPage.aboutPage.aboutCard).toBeVisible({
      timeout: 15000,
    });
    await expect(organizationPage.aboutPage.getInvolvedCard).toBeVisible({
      timeout: 15000,
    });
    await expect(organizationPage.aboutPage.connectCard).toBeVisible({
      timeout: 15000,
    });

    // Navigate to Events section using existing component object.
    await organizationPage.menu.eventsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/events/);
    await expect(organizationPage.eventsPage.eventsNewButton).toBeVisible();
    await expect(
      organizationPage.eventsPage.eventsSubscribeButton
    ).toBeVisible();
    // Navigate to Groups section.
    await organizationPage.menu.groupsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/groups/);

    // Navigate to Resources section.
    await organizationPage.menu.resourcesOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/resources/);

    // Navigate to FAQ section.
    await organizationPage.menu.questionsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/faq/);

    // Navigate to Discussions section.
    await organizationPage.menu.discussionsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/discussions/);

    // Navigate to Affiliates section.
    await organizationPage.menu.affiliatesOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/affiliates/);

    // Navigate back to About section.
    await organizationPage.menu.aboutOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/about/);
    await expect(organizationPage.aboutPage.getInvolvedCard).toBeVisible();
  });
});
