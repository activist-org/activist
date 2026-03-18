// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

import { getEnglishText } from "#shared/utils/i18n";
import { expect, test } from "playwright/test";

import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";

import { navigateToFirstOrganization } from "./organizations";

// MARK: Org Group Subpage

/**
 * Navigate to a group subpage within an organization
 * @param page - Playwright page object
 * @param subpage - The group subpage to navigate to (e.g., 'about', 'events', 'faq', 'resources')
 * @returns Object containing organizationId, groupId, and organizationPage
 */
export async function navigateToOrganizationGroupSubpage(
  page: Page,
  subpage: string
) {
  const currentUrl = page.url();
  if (
    currentUrl.includes(`/organizations/`) &&
    currentUrl.includes(`/groups/`) &&
    currentUrl.includes(`/${subpage}`)
  ) {
    return { organizationId: "", organizationPage: newOrganizationPage(page) };
  }

  const { organizationId, organizationPage } =
    await navigateToFirstOrganization(page);

  const viewportSize = page.viewportSize();
  const isMobileLayout = viewportSize ? viewportSize.width < 768 : false;

  if (isMobileLayout) {
    const submenu = page.locator("#submenu");
    await submenu.waitFor({ timeout: 5000 });

    const listboxButton = submenu.getByRole("button");
    await listboxButton.waitFor({ state: "attached", timeout: 5000 });

    const isAlreadyOpen =
      (await listboxButton.getAttribute("aria-expanded")) === "true";
    if (!isAlreadyOpen) {
      await listboxButton.click();
      await page.getByRole("listbox").waitFor({ timeout: 5000 });
    }

    await page.waitForLoadState("domcontentloaded");
    await expect(organizationPage.pageHeading).toBeVisible();
    await page.getByRole("listbox").waitFor({ timeout: 10000 });

    await expect(organizationPage.menu.groupsOption).toBeVisible();
    await page.waitForLoadState("domcontentloaded");

    const groupsOption = page.getByRole("option", {
      name: new RegExp(getEnglishText("i18n._global.groups"), "i"),
    });

    await groupsOption.click({ force: true });
  } else {
    await expect(organizationPage.menu.groupsOption).toBeVisible();
    await organizationPage.menu.groupsOption.click();
  }

  await page.waitForLoadState("domcontentloaded");
  await expect(page).toHaveURL(/\/organizations\/[a-f0-9-]{36}\/groups/);

  // Check if there are any groups available.
  const { groupsPage } = organizationPage;

  // Wait for groups to load completely.
  await page.waitForLoadState("domcontentloaded");

  // Wait for either groups or empty state to appear (same approach as working test).
  try {
    await expect(async () => {
      const groupsListVisible = await groupsPage.groupsList
        .isVisible()
        .catch(() => false);
      const emptyStateVisible = await groupsPage.emptyState
        .isVisible()
        .catch(() => false);
      expect(groupsListVisible || emptyStateVisible).toBe(true);
    }).toPass({ timeout: 5000 });
  } catch {
    // Groups list/empty state not found; continue with fallback.
  }

  await page.waitForLoadState("domcontentloaded");

  const groupCount = await groupsPage.getGroupCount();

  if (groupCount === 0) {
    test.skip(
      true,
      "No groups available to navigate to - skipping group subpage tests"
    );
    return {
      organizationId,
      groupId: null,
      organizationPage,
      groupsPage,
    };
  }

  const firstGroupLink = groupsPage.getGroupLink(0);
  const groupUrl = await firstGroupLink.getAttribute("href");

  if (!groupUrl) {
    throw new Error("Could not get group URL");
  }

  const groupId = groupUrl.match(/\/groups\/([a-f0-9-]{36})/)?.[1];

  if (!groupId) {
    throw new Error("Could not extract group ID from URL");
  }

  await groupsPage.navigateToGroup(0);
  await page.waitForURL(`**/groups/${groupId}/**`, { timeout: 5000 });
  await page.waitForLoadState("domcontentloaded");

  const tabList = page.getByRole("tablist");
  await expect(tabList).toBeVisible({ timeout: 5000 });

  const subpageTab = page.getByRole("tab", { name: subpage });
  await expect(subpageTab).toBeVisible({ timeout: 5000 });

  await subpageTab.click({ timeout: 5000 });

  await page.waitForLoadState("domcontentloaded");
  await page.waitForURL(`**/groups/${groupId}/${subpage}`, { timeout: 5000 });

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  return {
    organizationId,
    groupId,
    organizationPage,
    groupsPage,
  };
}
