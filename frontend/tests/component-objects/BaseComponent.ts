import type { Page, Locator } from "@playwright/test";
import { isMobile } from "../utils/utils";

export default abstract class BaseComponent {
  protected readonly page: Page;
  protected locators: Record<string, string> = {};

  constructor(page: Page) {
    this.page = page;
  }

  public async isMobile(): Promise<boolean> {
    return isMobile(this.page);
  }

  protected setLocators(locators: Record<string, string>): void {
    this.locators = locators;
  }

  public getLocator(key: keyof typeof this.locators): Locator {
    return this.page.locator(this.locators[key]);
  }
}
