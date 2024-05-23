import type { Page, Locator } from "@playwright/test";
import BaseComponent from "./BaseComponent";

export default class HeaderWebsite extends BaseComponent {
  public static readonly locators = {
    MOBILE_HEADER: "#mobile-header",
    DESKTOP_HEADER: "#desktop-header",
    ROADMAP_BUTTON: "#desktop-header #btn-roadmap",
    GET_IN_TOUCH_BUTTON:
      "#btn-get-in-touch-large:visible, #btn-get-in-touch-medium:visible",
    HAMBURGER: "#sidebar-right-hamburger:visible",
    SIDEBAR: "#drawer-navigation",
    THEME_DROPDOWN: ".dropdown-theme:visible",
    SELECTED_LANGUAGE: ".dropdown-language:visible .selected-option",
    LANGUAGE_DROPDOWN: ".dropdown-language:visible",
    LANGUAGE_MENU: ".dropdown-language:visible ul",
    LANGUAGE_OPTIONS:
      ".dropdown-language:visible .dropdown-language-list-items",
  };

  constructor(page: Page) {
    super(page);
    this.setLocators(HeaderWebsite.locators);
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

  get hamburger(): Locator {
    return this.getLocator("HAMBURGER");
  }

  get sidebar(): Locator {
    return this.getLocator("SIDEBAR");
  }

  async openSidebar(): Promise<void> {
    if (!(await this.sidebar.isVisible())) {
      await this.hamburger.click();
    }
  }

  async closeSidebar(): Promise<void> {
    if (await this.sidebar.isVisible()) {
      await this.hamburger.click();
    }
  }

  async selectDropdownOption(
    dropdown: Locator,
    optionText: string
  ): Promise<void> {
    await this.page.locator(`text=${optionText}`).click();
  }

  get themeDropdown(): Locator {
    return this.getLocator("THEME_DROPDOWN");
  }

  async openThemeDropdown(): Promise<void> {
    if (await this.isMobile()) {
      await this.openSidebar();
    }
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
    if (await this.isMobile()) {
      await this.openSidebar();
    }
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
    return (
      await this.page
        .locator(HeaderWebsite.locators.SELECTED_LANGUAGE)
        .innerText()
    )
      .trim()
      .toLowerCase();
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

  async navigateTo(link: Locator): Promise<void> {
    await link.click();
  }
}
