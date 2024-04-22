import { type Page, type Locator } from '@playwright/test';
import BasePage from './BasePage'

export default class LandingPage extends BasePage {
  public readonly requestAccessLink!: Locator;

  private static readonly REQUEST_ACCESS_LINK = 'a[href*="tally.so/r/nprxbq"]';
  private static readonly LANDING_SPLASH = '//*[@id="__nuxt"]/div[2]/div[3]/div[1]/div[1]/h1';

  constructor(page: Page) {
    super(page, 'Activist.org Landing Page', '/');
  }

  public async getRequestAccessLink() {
    return this.page.locator(LandingPage.REQUEST_ACCESS_LINK);
  }

  public async getLandingSplash() {
    return this.page.locator(LandingPage.LANDING_SPLASH);
  }
}
