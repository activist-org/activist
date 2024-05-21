import type { Page, Locator } from "@playwright/test";

export default abstract class BaseComponent {
  protected readonly page: Page;
  protected locators: Record<string, string> = {};

  constructor(page: Page) {
    this.page = page;
  }

  protected setLocators(locators: Record<string, string>): void {
    this.locators = locators;
  }

  public getLocator(key: keyof typeof this.locators): Locator {
    return this.page.locator(this.locators[key]);
  }
}
