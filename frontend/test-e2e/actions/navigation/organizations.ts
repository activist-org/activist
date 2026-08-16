// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

import { expect } from "playwright/test";

import { getEnglishText } from "#shared/utils/i18n";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { newOrganizationsHomePage } from "~/test-e2e/page-objects/OrganizationsHomePage";
import { selectMobileSubmenuOption } from "~/test-e2e/utils/combobox-helpers";

// MARK: First Organization

/**
 * Navigate to the first organization page from the organizations list
 * @param page - Playwright page object
 * @returns Object containing the orgId and organizationPage object
 */
export async function navigateToFirstOrganization(page: Page) {
  await page.goto("/organizations", { waitUntil: "domcontentloaded" });

  const organizationsHomePage = newOrganizationsHomePage(page);

  await expect(organizationsHomePage.heading).toBeVisible();
  await expect(organizationsHomePage.heading).toHaveText(
    getEnglishText("i18n.pages.organizations.index.header_title")
  );

  await expect(page.getByTestId("organization-card").first()).toBeVisible({
    timeout: 30000,
  });

  await expect(organizationsHomePage.organizationLink).toBeVisible({
    timeout: 5000,
  });

  const href =
    await organizationsHomePage.organizationLink.getAttribute("href");
  const orgId = href?.match(/\/organizations\/([a-f0-9-]{36})/)?.[1];

  if (!orgId) {
    throw new Error(`Could not extract organization ID from href: ${href}`);
  }

  await organizationsHomePage.organizationLink.click();
  await page.waitForURL(`**/organizations/${orgId}/**`);

  const organizationPage = newOrganizationPage(page);
  await expect(organizationPage.pageHeading).toBeVisible();

  return {
    orgId,
    organizationPage,
  };
}

// MARK: By ID

/**
 * Navigate directly to a specific organization page by ID
 * @param page - Playwright page object
 * @param orgId - The UUID of the organization
 * @returns OrganizationPage object
 */
export async function navigateToOrganization(page: Page, orgId: string) {
  await page.goto(`/organizations/${orgId}`);
  await page.waitForURL(`**/organizations/${orgId}/**`);

  const organizationPage = newOrganizationPage(page);
  await expect(organizationPage.pageHeading).toBeVisible();

  return organizationPage;
}

// MARK: Org Subpage

/**
 * Navigate to organization subpage using the appropriate navigation pattern for the platform
 * @param page - Playwright page object
 * @param subpage - The subpage to navigate to (e.g., 'events', 'resources', 'groups')
 * @returns Object containing orgId and organizationPage
 */
export async function navigateToOrganizationSubpage(
  page: Page,
  subpage: string
) {
  const subpageMapping: Record<string, string> = {
    faq: "questions",
  };

  const menuSubpage = subpageMapping[subpage] || subpage;

  const { orgId, organizationPage } = await navigateToFirstOrganization(page);

  const viewportSize = page.viewportSize();
  const isMobileLayout = viewportSize ? viewportSize.width < 768 : false;

  if (isMobileLayout) {
    await page.waitForLoadState("domcontentloaded");
    await expect(organizationPage.pageHeading).toBeVisible();

    // Exhaustive map of organization subpages to their menu entry i18n keys.
    // Mirrors the entries in `app/composables/useMenuEntriesState.ts`.
    // Static values keep i18n-check's nonexistent-keys check happy when this
    // file is included via search-dirs.
    const i18nKeyMap: Record<string, string> = {
      about: "i18n._global.about",
      events: "i18n._global.events",
      groups: "i18n._global.groups",
      resources: "i18n._global.resources",
      faq: "i18n._global.faq",
      affiliates: "i18n.composables.use_menu_entries_state.affiliates",
      tasks: "i18n.composables.use_menu_entries_state.tasks",
      discussions: "i18n._global.discussions",
      settings: "i18n._global.settings",
    };

    const i18nKey = i18nKeyMap[subpage];
    if (!i18nKey) {
      throw new Error(
        `Unknown organization subpage "${subpage}". Add it to i18nKeyMap in test-e2e/actions/navigation/organizations.ts.`
      );
    }

    await selectMobileSubmenuOption(
      page,
      new RegExp(getEnglishText(i18nKey), "i")
    );
  } else {
    // Desktop layout: uses direct tab navigation.
    await page.waitForLoadState("domcontentloaded");
    await expect(organizationPage.pageHeading).toBeVisible();

    const subpageOption =
      organizationPage.menu[
        `${menuSubpage}Option` as keyof typeof organizationPage.menu
      ];

    await expect(subpageOption).toBeVisible();
    await subpageOption.waitFor({ state: "attached" });

    await expect(async () => {
      const href = await subpageOption.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).toContain(`/${subpage}`);
    }).toPass({ timeout: 2000, intervals: [50, 100, 250] });

    await subpageOption.click();
  }

  await expect(page).toHaveURL(
    new RegExp(`.*\\/organizations\\/.*\\/${subpage}`)
  );

  return { orgId, organizationPage };
}

// MARK: First Org Event

/**
 * Navigate to the first event from the first organization's events page
 * @param page - Playwright page object
 * @returns Object containing orgId, eventId (if available), and page objects
 */
export async function navigateToFirstOrganizationEvent(page: Page) {
  const { orgId, organizationPage } = await navigateToFirstOrganization(page);

  await organizationPage.menu.eventsOption.click();
  await expect(page).toHaveURL(/.*\/organizations\/.*\/events/);

  const { eventsPage } = organizationPage;
  const eventCount = await eventsPage.getEventCount();

  if (eventCount === 0) {
    throw new Error("No events available to navigate to");
  }

  const firstEventLink = eventsPage.getEventLink(0);
  const eventUrl = await firstEventLink.getAttribute("href");

  if (!eventUrl) {
    throw new Error("Could not get event URL");
  }

  const eventId = eventUrl.match(/\/events\/([a-f0-9-]{36})/)?.[1];

  if (!eventId) {
    throw new Error("Could not extract event ID from URL");
  }

  await eventsPage.navigateToEvent(0);
  await page.waitForURL(`**/events/${eventId}/**`);

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  return {
    orgId,
    eventId,
    organizationPage,
    eventsPage,
  };
}
