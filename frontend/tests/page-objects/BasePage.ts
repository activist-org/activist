import type { Page, Locator } from "@playwright/test";
export default abstract class BasePage {
  protected readonly pageName: string;
  protected readonly pageURL: string;
  protected readonly page: Page;
  protected locators: Record<string, string> = {};

  constructor(page: Page, pageName: string, pageURL = "/") {
    this.page = page;
    this.pageName = pageName;
    this.pageURL = pageURL;
  }

  public static readonly urls = {
    REQUEST_ACCESS_URL:
      "https://app.formbricks.com/s/clvn9ywe21css8wqpt1hee57a",
  };

  public get getPage(): Page {
    return this.page;
  }

  public async goto(pageUrl: string = this.pageURL): Promise<void> {
    await this.page.goto(`${pageUrl}`);
  }

  public async isMobile(): Promise<boolean> {
    const viewportSize = await this.page.viewportSize();
    return viewportSize !== null && viewportSize.width < 768;
  }

  public async waitForUrlChange(expectedUrlPattern: string | RegExp | ((url: URL) => boolean), options?: { timeout?: number }): Promise<void> {
    const timeout = options?.timeout || 10000;
    await this.page.waitForURL(expectedUrlPattern, { timeout });
  }

  protected setLocators(locators: Record<string, string>): void {
    this.locators = locators;
  }

  public getLocator(key: keyof typeof this.locators): Locator {
    return this.page.locator(this.locators[key]);
  }
}
