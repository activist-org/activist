import type { Locator, Page } from "@playwright/test";
import locales from "../../locales";
import { PageObjectBase } from "../utils/PageObjectBase";
import { HeaderWebsite } from "../component-objects/HeaderWebsite";
import { Navigation } from "../component-objects/Navigation";

// Centralized locator management
const locators = {
  LANDING_SPLASH: "#landing-splash-header",
  REQUEST_ACCESS_LINK: "#request-access",
  VIEW_ORGANIZATIONS_BUTTON: "#view-organizations",
  VIEW_EVENTS_BUTTON: "#view-events",
  GET_ORGANIZED_BUTTON: "#btn-get-organized",
  GROW_ORGANIZATION_BUTTON: "#btn-grow-organization",
  ABOUT_BUTTON: "#btn-activist",
  BECOME_SUPPORTER_BUTTON: "#btn-become-supporter",
  OUR_SUPPORTERS_BUTTON: "#btn-our-supporters",
};

export class LandingPage extends PageObjectBase {
  readonly header: HeaderWebsite;
  readonly navigation: Navigation;

  constructor(page: Page) {
    super(page, locators, "Landing Page", "/");
    this.header = new HeaderWebsite(page);
    this.navigation = new Navigation(page);
  }

  public static readonly urls = {
    REQUEST_ACCESS_URL: "https://app.formbricks.com/s/clvn9ywe21css8wqpt1hee57a",
  };

  get landingSplash(): Locator {
    return this.getLocator("LANDING_SPLASH");
  }

  get requestAccessLink(): Locator {
    return this.getLocator("REQUEST_ACCESS_LINK");
  }

  get viewOrganizationsButton(): Locator {
    return this.getLocator("VIEW_ORGANIZATIONS_BUTTON");
  }

  get viewEventsButton(): Locator {
    return this.getLocator("VIEW_EVENTS_BUTTON");
  }

  get getOrganizedButton(): Locator {
    return this.getLocator("GET_ORGANIZED_BUTTON");
  }

  get growOrganizationButton(): Locator {
    return this.getLocator("GROW_ORGANIZATION_BUTTON");
  }

  get aboutButton(): Locator {
    return this.getLocator("ABOUT_BUTTON");
  }

  get becomeSupportersButton(): Locator {
    return this.getLocator("BECOME_SUPPORTER_BUTTON");
  }

  get ourSupportersButton(): Locator {
    return this.getLocator("OUR_SUPPORTERS_BUTTON");
  }

  async getImportantLinks(): Promise<Locator[]> {
    return [
      this.landingSplash,
      this.viewOrganizationsButton,
      this.viewEventsButton,
      this.getOrganizedButton,
      this.growOrganizationButton,
      this.aboutButton,
      this.becomeSupportersButton,
      this.ourSupportersButton,
    ];
  }

  async getVisibleHeader(): Promise<Locator> {
    return (await this.isMobile())
      ? this.header.mobileHeader
      : this.header.desktopHeader;
  }

  async checkRoadmapButtonVisibility(): Promise<boolean> {
    if (await this.isMobile()) {
      return this.header.roadmapButton.isHidden();
    } else {
      await this.header.navigateToRoadmap();
      await this.waitForUrlChange("**/about/roadmap");
      return this.url().includes("/about/roadmap");
    }
  }

  async checkGetInTouchButtonFunctionality(): Promise<boolean> {
    if (await this.isMobile()) {
      return this.header.getInTouchButton.isHidden();
    } else {
      await this.header.getInTouchButton.click();
      await this.waitForUrlChange("**/contact");
      return this.url().includes("/contact");
    }
  }

  async selectThemeOption(theme: string): Promise<void> {
    if (await this.isMobile()) {
      await this.navigation.mobileNav.selectThemeOption(theme);
    } else {
      await this.header.selectThemeOption(theme);
    }
  }

  async getVisibleLanguageOptions(): Promise<Locator[]> {
    const selectedLanguage = await this.isMobile()
      ? await this.navigation.mobileNav.getSelectedLanguage()
      : await this.header.getSelectedLanguage();

    const languageOptions = await this.isMobile()
      ? await this.navigation.mobileNav.getLanguageOptions()
      : await this.header.getLanguageOptions();

    const visibleOptions: Locator[] = [];

    for (const locale of locales) {
      if (locale.code === selectedLanguage) {
        continue;
      }
      const optionText = locale.name;
      const option = await this.isMobile()
        ? await this.navigation.mobileNav.findLanguageOption(languageOptions, optionText)
        : await this.header.findLanguageOption(languageOptions, optionText);

      if (option && await option.isVisible()) {
        visibleOptions.push(option);
      }
    }

    return visibleOptions;
  }

  async isViewOrganizationsButtonVisible(): Promise<boolean> {
    return this.viewOrganizationsButton.isVisible();
  }

  async isViewEventsButtonVisible(): Promise<boolean> {
    return this.viewEventsButton.isVisible();
  }

  async navigateToViewOrganizations(): Promise<void> {
    await this.viewOrganizationsButton.click();
    await this.waitForUrlChange("**/organizations");
  }

  async navigateToViewEvents(): Promise<void> {
    await this.viewEventsButton.click();
    await this.waitForUrlChange("**/events");
  }

  async isSignInButtonVisible(): Promise<boolean> {
    if (await this.isMobile()) {
      await this.navigation.mobileNav.openDrawer();
      await this.navigation.openUserOptions();
      return await this.navigation.signIn.isVisible();
    } else {
      return await this.header.isSignInButtonVisible();
    }
  }

  async navigateToSignIn(): Promise<void> {
    if (await this.isMobile()) {
      await this.navigation.mobileNav.openDrawer();
      await this.navigation.openUserOptions();
      await this.navigation.signIn.isVisible();
      await this.navigation.signIn.click();
    } else {
      await this.header.clickSignInButton();
    }
    await this.waitForUrlChange("**/auth/sign-in");
  }

  async isSignUpButtonVisible(): Promise<boolean> {
    if (await this.isMobile()) {
      await this.navigation.mobileNav.openDrawer();
      await this.navigation.openUserOptions();
      return await this.navigation.signUp.isVisible();
    } else {
      return await this.header.isSignUpButtonVisible();
    }
  }

  async navigateToSignUp(): Promise<void> {
    if (await this.isMobile()) {
      await this.navigation.mobileNav.openDrawer();
      await this.navigation.openUserOptions();
      await this.navigation.signUp.click();
    } else {
      await this.header.clickSignUpButton();
    }
    await this.waitForUrlChange("**/auth/sign-up");
  }
}
