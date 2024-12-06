import type { Page, Locator } from "@playwright/test";
import { PageObjectBase } from "../utils/PageObjectBase";

const locators = {
  TOGGLE: "#submenu",
  OPTIONS: "#submenu ul",
  ABOUT: "#org-about",
  EVENTS: "#org-events",
  GROUPS: "#org-groups",
  RESOURCES: "#org-resources",
  FAQ: "#org-faq",
  AFFILIATES: "#org-affiliates",
  TASKS: "#org-tasks",
  DISCUSSIONS: "#org-discussions",
  SETTINGS: "#org-settings",
};

export class OrganizationMenu extends PageObjectBase {
  constructor(page: Page) {
    super(page, locators);
  }

  get toggle(): Locator {
    return this.getLocator("TOGGLE");
  }

  get options(): Locator {
    return this.getLocator("OPTIONS");
  }

  get about(): Locator {
    return this.getLocator("ABOUT");
  }

  get events(): Locator {
    return this.getLocator("EVENTS");
  }

  get groups(): Locator {
    return this.getLocator("GROUPS");
  }

  get resources(): Locator {
    return this.getLocator("RESOURCES");
  }

  get faq(): Locator {
    return this.getLocator("FAQ");
  }

  get affiliates(): Locator {
    return this.getLocator("AFFILIATES");
  }

  get tasks(): Locator {
    return this.getLocator("TASKS");
  }

  get discussions(): Locator {
    return this.getLocator("DISCUSSIONS");
  }

  get settings(): Locator {
    return this.getLocator("SETTINGS");
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.toggle.click();
    }
  }

  override async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.toggle.click();
    }
  }

  async isOpen(): Promise<boolean> {
    return (await this.toggle.getAttribute("aria-expanded")) === "true";
  }

  override async isVisible(): Promise<boolean> {
    return await this.toggle.isVisible();
  }

  async isOptionsVisible(): Promise<boolean> {
    return await this.options.isVisible();
  }

  async getActiveSelectedOption(): Promise<string> {
    // if mobile, then "[data-headlessui-state='active selected']"
    // if desktop, then class includes style-menu-option-cta
    const selector = (await this.isMobile())
      ? "[data-headlessui-state='active selected']"
      : ".style-menu-option-cta";
    return (await this.options.locator(selector).textContent()) || "";
  }
}
