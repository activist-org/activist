import type { Locator, Page } from "@playwright/test";
import { isMobile } from "../utils/utils";
export default abstract class BasePage {
  protected readonly pageName: string;
  protected readonly pageUrl: string;
  protected readonly page: Page;
  protected locators: Record<string, string> = {};

  constructor(page: Page, pageName: string, pageUrl = "/") {
    this.page = page;
    this.pageName = pageName;
    this.pageUrl = pageUrl;
  }

  public static readonly urls = {
    REQUEST_ACCESS_URL:
      "https://app.formbricks.com/s/clvn9ywe21css8wqpt1hee57a",
  };

  public get getPage(): Page {
    return this.page;
  }

  public async goto(pageUrl: string = this.pageUrl): Promise<void> {
    await this.page.goto(`${pageUrl}`);
  }

  public async isMobile(): Promise<boolean> {
    return isMobile(this.page);
  }

  public async waitForUrlChange(
    expectedUrlPattern: string | RegExp | ((url: URL) => boolean),
    options?: { timeout?: number }
  ): Promise<void> {
    const timeout = options?.timeout || 10000;
    await this.page.waitForURL(expectedUrlPattern, { timeout });
  }

  public async currentTheme(): Promise<string> {
    return (await this.page.locator("html").getAttribute("class")) ?? "";
  }

  protected setLocators(locators: Record<string, string>): void {
    this.locators = locators;
  }

  public getLocator(key: keyof typeof this.locators): Locator {
    return this.page.locator(this.locators[key]);
  }
}
