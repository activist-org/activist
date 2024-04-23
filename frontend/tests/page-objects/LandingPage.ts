import { type Page, type Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class LandingPage extends BasePage {
  public static readonly locators = {
    LANDING_SPLASH: '//*[@id="__nuxt"]/div[2]/div[3]/div[1]/div[1]/h1',
    REQUEST_ACCESS_LINK: 'a[href*="tally.so/r/nprxbq"]',
    GET_ACTIVE_LINK: 'a[href*="docs/get-active"]',
    GET_ORGANIZED_LINK: 'a[href*="docs/get-organized"]',
    GROW_ORGANIZATION_LINK: 'a[href*="docs/grow-organization"]',
    ABOUT_LINK: 'a[href*="about/activist"]',
    SUPPORTERS_LINK: 'a[href*="supporters/join"]',
  };

  constructor(page: Page) {
    super(page, "Activist.org Landing Page", "/");
  }

  public getLocator(key: keyof typeof LandingPage.locators): Locator {
    return this.page.locator(LandingPage.locators[key]);
  }
}
