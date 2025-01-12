// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";
import { PageObjectBase } from "../utils/PageObjectBase";

const locators = {
  HAMBURGER: "#sidebar-right-hamburger:visible",
  DRAWER_NAVIGATION: "#drawer-navigation",
  THEME_DROPDOWN: ".dropdown-theme:visible",
  SELECTED_LANGUAGE: ".dropdown-language:visible .selected-option",
  LANGUAGE_DROPDOWN: ".dropdown-language:visible",
  LANGUAGE_MENU: ".dropdown-language:visible ul",
  LANGUAGE_OPTIONS: ".dropdown-language:visible .dropdown-language-list-items",
};

export class MobileNav extends PageObjectBase {
  constructor(page: Page) {
    super(page, locators);
  }

  get hamburger(): Locator {
    return this.getLocator("HAMBURGER");
  }

  get drawer(): Locator {
    return this.getLocator("DRAWER_NAVIGATION");
  }

  async openDrawer(): Promise<void> {
    if (!(await this.drawer.isVisible())) {
      await this.hamburger.click();
    }
  }

  async closeDrawer(): Promise<void> {
    if (await this.drawer.isVisible()) {
      await this.hamburger.click();
    }
  }

  get themeDropdown(): Locator {
    return this.getLocator("THEME_DROPDOWN");
  }

  async openThemeDropdown(): Promise<void> {
    await this.openDrawer();
    await this.themeDropdown.click();
  }

  async selectThemeOption(theme: string): Promise<void> {
    await this.openThemeDropdown();
    await this.selectDropdownOption(this.themeDropdown, theme);
  }

  get languageDropdown(): Locator {
    return this.getLocator("LANGUAGE_DROPDOWN");
  }

  async openLanguageDropdown(): Promise<void> {
    await this.openDrawer();
    const isDropdownOpen = await this.getLocator("LANGUAGE_MENU").isVisible();
    if (!isDropdownOpen) {
      await this.languageDropdown.click();
    }
  }

  async selectLanguageOption(language: string): Promise<void> {
    await this.openLanguageDropdown();
    await this.selectDropdownOption(this.languageDropdown, language);
  }

  async getSelectedLanguage(): Promise<string> {
    await this.openLanguageDropdown();
    const selectedLanguageElement = this.getLocator("SELECTED_LANGUAGE");
    const text = await selectedLanguageElement.innerText();
    return text.trim().toLowerCase();
  }

  async getLanguageOptions(): Promise<Locator[]> {
    await this.openLanguageDropdown();
    const languageOptions = await this.getLocator("LANGUAGE_OPTIONS").all();
    return languageOptions;
  }

  async findLanguageOption(
    languageOptions: Locator[],
    optionText: string
  ): Promise<Locator | undefined> {
    for (const option of languageOptions) {
      const textContent = await option.innerText();
      if (textContent.includes(optionText)) {
        return option;
      }
    }
    return undefined;
  }

  async selectDropdownOption(
    dropdown: Locator,
    optionText: string
  ): Promise<void> {
    await dropdown.locator(`text=${optionText}`).click();
  }
}
