import type { Page, Locator } from "@playwright/test";
import { PageObjectBase } from "../utils/PageObjectBase";

const locators = {
  SEARCH: "#search",
  SEARCH_TOGGLE: "#search-toggle",
  SEARCH_INPUT: "#input-search",
  SEARCH_MODAL: "#search-modal",
  CLOSE_SEARCH_MODAL: "#search-modal button",
};

export class SearchBar extends PageObjectBase {
  constructor(page: Page) {
    super(page, locators);
  }

  get search(): Locator {
    return this.getLocator("SEARCH");
  }

  get searchInput(): Locator {
    return this.getLocator("SEARCH_INPUT");
  }

  get searchToggle(): Locator {
    return this.getLocator("SEARCH_TOGGLE");
  }

  get searchModal(): Locator {
    return this.getLocator("SEARCH_MODAL");
  }

  async fillSearchInput(text: string): Promise<void> {
    await this.searchInput.fill(text);
  }

  async isSearchInputFocused(): Promise<boolean> {
    return this.searchInput.evaluate((el) => el === document.activeElement);
  }

  async isSearchInputVisible(): Promise<boolean> {
    return this.searchInput.isVisible();
  }

  async getSearchInputPlaceholder(): Promise<string | null> {
    return this.searchInput.getAttribute("placeholder");
  }

  async pressSlashKey(): Promise<void> {
    await this.page.keyboard.press("/");
  }

  async pressCommandOrControlK(): Promise<void> {
    const isMac = await this.page.evaluate(() =>
      /Mac/i.test(navigator.userAgent)
    );
    if (isMac) {
      await this.page.keyboard.press("Meta+K");
    } else {
      await this.page.keyboard.press("Control+K");
    }
  }

  async clickCloseSearchModal(): Promise<void> {
    await this.getLocator("CLOSE_SEARCH_MODAL").click();
  }

  async isSearchModalVisible(): Promise<boolean> {
    return this.searchModal.isVisible();
  }

  async fillSearchModalInput(text: string): Promise<void> {
    await this.searchModal.fill(text);
  }

  async openSearchInput(): Promise<void> {
    if ((await this.isMobile()) && !(await this.isSearchInputVisible())) {
      await this.searchToggle.click();
    } else if (
      !(await this.isMobile()) &&
      !(await this.isSearchInputVisible())
    ) {
      await this.search.click();
    }
  }

  async closeSearchInput(): Promise<void> {
    if ((await this.isMobile()) && (await this.isSearchInputVisible())) {
      await this.searchToggle.click();
    } else if (
      !(await this.isMobile()) &&
      (await this.isSearchInputVisible())
    ) {
      await this.page.click("#home-header");
    }
  }
}
