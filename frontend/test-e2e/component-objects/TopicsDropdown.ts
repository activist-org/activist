// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";
import { PageObjectBase } from "../utils/PageObjectBase";

const locators = {
  TOPICS_DROPDOWN: "#topics-dropdown",
  TOPICS_OPTIONS: "#topics-dropdown ul#isVisibleElement",
};

export class TopicsDropdown extends PageObjectBase {
  constructor(page: Page) {
    super(page, locators);
  }

  get dropdown(): Locator {
    return this.getLocator("TOPICS_DROPDOWN");
  }
  get options(): Locator {
    return this.getLocator("TOPICS_OPTIONS");
  }

  async openTopicsDropdown(): Promise<void> {
    if (!(await this.options.isVisible())) {
      await this.dropdown.click();
    }
  }

  async closeTopicsDropdown(): Promise<void> {
    if (await this.options.isVisible()) {
      await this.dropdown.click();
    }
  }
}
