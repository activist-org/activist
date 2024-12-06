import type { Page, Locator } from "@playwright/test";

export class PageObjectBase {
  [key: string]: any;

  protected readonly page: Page;
  protected readonly pageName?: string;
  protected readonly pageURL?: string;
  protected locators: Record<string, string> = {};

  constructor(
    page: Page,
    locators: Record<string, string>,
    pageName?: string,
    pageURL?: string
  ) {
    this.page = page;
    this.locators = locators;
    this.pageName = pageName;
    this.pageURL = pageURL;
    return new Proxy(this, {
      get: (target: PageObjectBase, prop: string | symbol) => {
        if (prop in target) {
          return (target as any)[prop];
        }
        return (target.page as any)[prop];
      },
    }) as PageObjectBase & Page;
  }

  public async getPageName(): Promise<string> {
    return this.pageName ?? "Unknown Page";
  }

  public async isMobile(): Promise<boolean> {
    const viewportSize = this.page.viewportSize();
    const isMobileViewport = viewportSize !== null && viewportSize.width < 768;
    const isMobileEmulation = await this.page.evaluate(
      () => "ontouchstart" in window
    );
    return isMobileViewport && isMobileEmulation;
  }

  public async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState("networkidle");
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

  public getLocator(selector: keyof typeof this.locators): Locator {
    return this.page.locator(this.locators[selector]);
  }
}

export interface PageObjectBase extends Page {}
