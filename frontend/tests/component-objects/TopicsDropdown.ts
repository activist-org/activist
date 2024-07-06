import type { Page, Locator } from "@playwright/test";
import BaseComponent from "./BaseComponent";

export default class TopicsDropdown extends BaseComponent {
  public static readonly locators = {
    TOPICS_DROPDOWN: "#topics-dropdown",
    TOPICS_OPTIONS: "#topics-dropdown ul#isVisibleElement"
  };

  constructor(page: Page) {
    super(page);
    this.setLocators(TopicsDropdown.locators);
  }

  get topicsDropdown(): Locator {
    return this.getLocator("TOPICS_DROPDOWN");
  }
  get topicsOptions(): Locator {
    return this.getLocator("TOPICS_OPTIONS");
  }

  async openTopicsDropdown(): Promise<void> {
    if (!(await this.topicsOptions.isVisible())) {
      await this.topicsDropdown.click();
    }
  }

  async closeTopicsDropdown(): Promise<void> {
    if (await this.topicsOptions.isVisible()) {
      await this.topicsDropdown.click();
    }
  }
}
