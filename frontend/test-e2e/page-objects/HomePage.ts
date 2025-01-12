// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";
import { PageObjectBase } from "../utils/PageObjectBase";
import { HeaderWebsite } from "../component-objects/HeaderWebsite";
import { TopicsDropdown } from "../component-objects/TopicsDropdown";
import { SidebarLeft } from "../component-objects/SidebarLeft";
import { Navigation } from "../component-objects/Navigation";
const locators = {
  HOME_HEADER: "#home-header",
};

export class HomePage extends PageObjectBase {
  readonly header: HeaderWebsite;
  readonly topics: TopicsDropdown;
  readonly sidebarLeft: SidebarLeft;
  readonly navigation: Navigation;

  constructor(page: Page) {
    super(page, locators, "Home Page", "/home");
    this.header = new HeaderWebsite(page);
    this.topics = new TopicsDropdown(page);
    this.sidebarLeft = new SidebarLeft(page);
    this.navigation = new Navigation(page);
  }

  get homeHeader(): Locator {
    return this.getLocator("HOME_HEADER");
  }

  async checkTopicsDropdownFunctionality(): Promise<void> {
    await this.topics.openTopicsDropdown();
    await this.topics.options.waitFor({ state: "visible" });
    await this.topics.closeTopicsDropdown();
    await this.topics.options.waitFor({ state: "hidden" });
  }

  async checkSidebarVisibilityOnDesktop(): Promise<boolean> {
    return this.sidebarLeft.component.isVisible();
  }

  async checkSidebarExpandCollapse(): Promise<boolean[]> {
    if (await this.isMobile()) {
      return [];
    }

    const isToggleExpanded =
      await this.sidebarLeft.isSidebarLeftToggleExpanded();
    if (!isToggleExpanded) {
      return [];
    }

    const results: boolean[] = [];
    results.push(!(await this.sidebarLeft.isSidebarCollapsed()));

    await this.sidebarLeft.clickSidebarLeftToggle();
    await this.sidebarLeft.hoverOutsideSidebar();
    results.push(await this.sidebarLeft.isSidebarCollapsed());

    await this.sidebarLeft.hoverIntoSidebarLeft();
    results.push(!(await this.sidebarLeft.isSidebarCollapsed()));

    return results;
  }

  async checkNavigationMenus(): Promise<boolean[]> {
    const results: boolean[] = [];

    if (await this.isMobile()) {
      await this.navigation.mobileNav.openDrawer();
    }

    // Test Info dropdown
    await this.navigation.info.click();
    results.push(await this.navigation.help.isVisible());
    results.push(await this.navigation.docs.isVisible());
    results.push(await this.navigation.legal.isVisible());
    await this.navigation.info.click();
    results.push(await this.navigation.help.isHidden());
    results.push(await this.navigation.docs.isHidden());
    results.push(await this.navigation.legal.isHidden());

    // Test User Options dropdown
    await this.navigation.userOptions.click();
    results.push(await this.navigation.signIn.isVisible());
    results.push(await this.navigation.signUp.isVisible());
    await this.navigation.userOptions.click();
    results.push(await this.navigation.signIn.isHidden());
    results.push(await this.navigation.signUp.isHidden());

    if (await this.isMobile()) {
      await this.navigation.mobileNav.closeDrawer();
    }

    return results;
  }

  async checkNavigationLinks(): Promise<string[]> {
    const results: string[] = [];

    const tabs = [
      { nav: this.navigation.organizations, path: "/organizations" },
      { nav: this.navigation.home, path: "/home" },
      { nav: this.navigation.events, path: "/events" },
    ];

    const menuLinks = [
      {
        nav: this.navigation.help,
        path: "/help",
        parent: this.navigation.info,
      },
      {
        nav: this.navigation.docs,
        path: "/docs",
        parent: this.navigation.info,
      },
      {
        nav: this.navigation.legal,
        path: "/legal",
        parent: this.navigation.info,
      },
      {
        nav: this.navigation.signIn,
        path: "/auth/sign-in",
        parent: this.navigation.userOptions,
      },
      {
        nav: this.navigation.signUp,
        path: "/auth/sign-up",
        parent: this.navigation.userOptions,
      },
    ];

    // Check tab links
    for (const tab of tabs) {
      try {
        await tab.nav.waitFor({ state: "visible", timeout: 5000 });
        await this.page.waitForLoadState("networkidle");
        await tab.nav.click({ force: true });
        await this.waitForUrlChange(`**${tab.path}`);
        results.push(this.url());
      } catch (error) {
        console.error(`Error navigating to ${tab.path}: ${error}`);
        results.push(`Error: ${tab.path}`);
      }
    }

    for (const link of menuLinks) {
      try {
        if (await this.isMobile()) {
          await this.navigation.mobileNav.openDrawer();
        }

        if (link.parent) {
          await link.parent.click();
        }
        await link.nav.waitFor({ state: "visible", timeout: 5000 });
        await this.page.waitForLoadState("networkidle");
        await link.nav.click({ force: true });
        await this.waitForUrlChange(`**${link.path}`);
        results.push(this.url());
        if (link.parent) {
          await this.goBack();
        }
      } catch (error) {
        console.error(`Error navigating to ${link.path}: ${error}`);
        results.push(`Error: ${link.path}`);
      }
    }

    return results;
  }

  async checkHotKeyFunctionality(): Promise<[boolean, boolean, boolean]> {
    await this.header.searchBar.pressSlashKey();
    const isSearchInputFocused =
      await this.header.searchBar.isSearchInputFocused();

    await this.header.searchBar.pressCommandOrControlK();
    const isExpandedSearchInputVisible =
      await this.header.searchBar.isSearchModalVisible();

    await this.header.searchBar.clickCloseSearchModal();
    const isExpandedSearchInputHidden =
      !(await this.header.searchBar.isSearchModalVisible());

    return [
      isSearchInputFocused,
      isExpandedSearchInputVisible,
      isExpandedSearchInputHidden,
    ];
  }

  async checkSearchFunctionality(): Promise<boolean[]> {
    const results: boolean[] = [];
    const isMobile = await this.isMobile();

    // Check if search toggle/input is visible
    results.push(
      isMobile
        ? await this.header.searchBar.searchToggle.isVisible()
        : await this.header.searchBar.search.isVisible()
    );

    // Open search input
    await this.header.searchBar.openSearchInput();

    // Check if search input is visible
    results.push(await this.header.searchBar.isSearchInputVisible());

    // Fill search input
    await this.header.searchBar.fillSearchInput("test search");

    // Check if search input has correct value
    const inputValue = await this.header.searchBar.searchInput.inputValue();
    results.push(inputValue === "test search");

    // Close search
    if (!isMobile) {
      await this.sidebarLeft.collapseSidebar();
    }
    await this.header.searchBar.closeSearchInput();

    // Check if search input is hidden
    results.push(!(await this.header.searchBar.isSearchInputVisible()));

    return results;
  }
}
