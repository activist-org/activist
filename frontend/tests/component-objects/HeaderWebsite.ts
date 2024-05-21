import type { Page, Locator } from "@playwright/test";
import BaseComponent from "./BaseComponent";

export default class HeaderWebsite extends BaseComponent {
  public static readonly locators = {
    MOBILE_HEADER: "#mobile-header",
    DESKTOP_HEADER: "#desktop-header",
    ROADMAP_BUTTON: "#desktop-header #btn-roadmap",
    GET_IN_TOUCH_BUTTON:
      "#btn-get-in-touch-large:visible, #btn-get-in-touch-medium:visible",
    THEME_DROPDOWN: ".dropdown-theme:visible",
    LANGUAGE_DROPDOWN: ".dropdown-language:visible",
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

  async selectDropdownOption(
    dropdown: Locator,
    optionText: string
  ): Promise<void> {
    await dropdown.click();
    await this.page.locator(`text=${optionText}`).click();
  }

  get themeDropdown(): Locator {
    return this.getLocator("THEME_DROPDOWN");
  }

  async selectThemeOption(theme: string): Promise<void> {
    await this.selectDropdownOption(this.themeDropdown, theme);
  }

  get languageDropdown(): Locator {
    return this.getLocator("LANGUAGE_DROPDOWN");
  }

  async selectLanguageOption(language: string): Promise<void> {
    await this.selectDropdownOption(this.languageDropdown, language);
  }

  async navigateTo(link: Locator): Promise<void> {
    await link.click();
  }
}
