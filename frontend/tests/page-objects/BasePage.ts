import type { Page } from "@playwright/test";

export default abstract class BasePage {
  protected readonly pageName: string;
  protected readonly pageURL: string;
  protected readonly page: Page;

  constructor(page: Page, pageName: string, pageURL = "/") {
    this.page = page;
    this.pageName = pageName;
    this.pageURL = pageURL;
  }

  public get getPage(): Page {
    return this.page;
  }

  public async goto(pageUrl: string = this.pageURL): Promise<void> {
    await this.page.goto(`${pageUrl}`);
  }

  public async getPageUrl(): Promise<string> {
    return this.page.url();
  }

  public async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}
