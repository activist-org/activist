import type { Page } from "@playwright/test";

export default abstract class BaseComponent {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
