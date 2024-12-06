import type { Page, Locator } from "@playwright/test";
import { PageObjectBase } from "../utils/PageObjectBase";
import { SearchBar } from "./SearchBar";

const locators = {
  MOBILE_HEADER: "#mobile-header",
  DESKTOP_HEADER: "#desktop-header",
  ROADMAP_BUTTON: "#desktop-header #btn-roadmap",
  GET_IN_TOUCH_BUTTON:
    "#btn-get-in-touch-large:visible, #btn-get-in-touch-medium:visible",
  SIGN_IN_BUTTON: "#btn-sign-in-large:visible, #btn-sign-in-medium:visible",
  SIGN_UP_BUTTON: "#btn-sign-up-large:visible, #btn-sign-up-medium:visible",
  THEME_DROPDOWN: ".dropdown-theme:visible",
  SELECTED_LANGUAGE: ".dropdown-language:visible .selected-option",
  LANGUAGE_DROPDOWN: ".dropdown-language:visible",
  LANGUAGE_MENU: ".dropdown-language:visible ul",
  LANGUAGE_OPTIONS: ".dropdown-language:visible .dropdown-language-list-items",
};

export class HeaderWebsite extends PageObjectBase {
  readonly searchBar: SearchBar;

  constructor(page: Page) {
    super(page, locators);
    this.searchBar = new SearchBar(page);
  }

  get mobileHeader(): Locator {
    return this.getLocator("MOBILE_HEADER");
  }

  get desktopHeader(): Locator {
    return this.getLocator("DESKTOP_HEADER");
  }

  get roadmapButton(): Locator {
    return this.getLocator("ROADMAP_BUTTON");
  }

  async navigateToRoadmap(): Promise<void> {
    await this.roadmapButton.click();
  }

  get getInTouchButton(): Locator {
    return this.getLocator("GET_IN_TOUCH_BUTTON");
  }

  get signInButton(): Locator {
    return this.getLocator("SIGN_IN_BUTTON");
  }

  get signUpButton(): Locator {
    return this.getLocator("SIGN_UP_BUTTON");
  }

  async selectDropdownOption(
    dropdown: Locator,
    optionText: string
  ): Promise<void> {
    await dropdown.locator(`text=${optionText}`).click();
  }

  get themeDropdown(): Locator {
    return this.getLocator("THEME_DROPDOWN");
  }

  async openThemeDropdown(): Promise<void> {
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

  async searchFor(text: string): Promise<void> {
    await this.searchBar.fillSearchInput(text);
  }

  async isSearchBarVisible(): Promise<boolean> {
    return this.searchBar.isSearchInputVisible();
  }

  async isSignInButtonVisible(): Promise<boolean> {
    return this.signInButton.isVisible();
  }

  async clickSignInButton(): Promise<void> {
    await this.signInButton.click();
  }

  async isSignUpButtonVisible(): Promise<boolean> {
    return this.signUpButton.isVisible();
  }

  async clickSignUpButton(): Promise<void> {
    await this.signUpButton.click();
  }
}
