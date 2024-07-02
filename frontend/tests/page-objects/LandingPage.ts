import type { Page, Locator } from "@playwright/test";
import BasePage from "./BasePage";
import HeaderWebsite from "../component-objects/HeaderWebsite";

export default class LandingPage extends BasePage {
  public static readonly locators = {
    LANDING_SPLASH: "#landing-splash-header",
    REQUEST_ACCESS_LINK: "#request-access",
    GET_ACTIVE_BUTTON: "#btn-get-active",
    GET_ORGANIZED_BUTTON: "#btn-get-organized",
    GROW_ORGANIZATION_BUTTON: "#btn-grow-organization",
    ABOUT_BUTTON: "#btn-activist",
    OUR_SUPPORTERS_BUTTON: "#btn-our-supporters",
  };

  readonly header: HeaderWebsite;

  constructor(page: Page) {
    super(page, "Activist.org Landing Page", "/");
    this.header = new HeaderWebsite(page);
    this.setLocators(LandingPage.locators);
  }

  get landingSplash(): Locator {
    return this.getLocator("LANDING_SPLASH");
  }

  get requestAccessLink(): Locator {
    return this.getLocator("REQUEST_ACCESS_LINK");
  }

  get getActiveButton(): Locator {
    return this.getLocator("GET_ACTIVE_BUTTON");
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

  get ourSupportersButton(): Locator {
    return this.getLocator("OUR_SUPPORTERS_BUTTON");
  }
}
