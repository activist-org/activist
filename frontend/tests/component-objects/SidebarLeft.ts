import type { Page, Locator } from "@playwright/test";
import { PageObjectBase } from "../utils/PageObjectBase";
import { Navigation } from "./Navigation";

const locators = {
  SIDEBAR_LEFT: "#sidebar-left",
  SIDEBAR_LEFT_TOGGLE: "#sidebar-left-toggle",
  SIDEBAR_LEFT_INFO: "#info button",
};

export class SidebarLeft extends PageObjectBase {
  constructor(page: Page) {
    super(page, locators);
    this.nav = new Navigation(page);
  }

  get component(): Locator {
    return this.getLocator("SIDEBAR_LEFT");
  }
  get sidebarLeftToggle(): Locator {
    return this.getLocator("SIDEBAR_LEFT_TOGGLE");
  }

  // click on the sidebar left toggle
  async clickSidebarLeftToggle(): Promise<void> {
    await this.sidebarLeftToggle.click();
  }

  // is sidebar left sticky expanded (has class -rotate-180)
  async isSidebarLeftToggleExpanded(): Promise<boolean> {
    const toggleClass = await this.sidebarLeftToggle.getAttribute("class");
    return toggleClass?.includes("-rotate-180") ?? false;
  }

  // is sidebar left collapsed (does not have class -rotate-180)
  async isSidebarLeftToggleCollapsed(): Promise<boolean> {
    const toggleClass = await this.sidebarLeftToggle.getAttribute("class");
    return toggleClass?.includes("pb-1 pl-0.5") ?? false;
  }

  async collapseSidebar(): Promise<void> {
    const isExpanded = await this.isSidebarLeftToggleExpanded();
    if (isExpanded) {
      await this.clickSidebarLeftToggle();
      await this.hoverOutsideSidebar();
      await this.page.waitForSelector('#sidebar-left.w-16', { state: 'attached' });
    }
  }

  // hover over the sidebar left
  async hoverSidebarLeft(): Promise<void> {
    await this.component.hover();
  }

  // hover to the right of the sidebar left
  async hoverOutsideSidebar(): Promise<void> {
    const boundingBox = await this.component.boundingBox();
    if (!boundingBox) {
      throw new Error("Unable to get bounding box of SidebarLeft");
    }

    const { x, y, width, height } = boundingBox;

    // Move the mouse to the right of the sidebar
    const outsideX = x + width + 10; // 10 pixels to the right of the sidebar
    const outsideY = y + height / 2; // Vertically centered

    await this.page.mouse.move(outsideX, outsideY);
  }

  async hoverIntoSidebarLeft(): Promise<void> {
    // determine the the width of the visible sidebar
    const boundingBox = await this.component.boundingBox();
    const x = boundingBox?.x ?? 0;
    const y = boundingBox?.y ?? 0;
    // move mouse to the center of the sidebar
    await this.page.mouse.move(x / 2, y / 2);
  }

  // is sidebar collapsed (has class w-16)
  async isSidebarCollapsed(): Promise<boolean> {
    return (await this.component.getAttribute("class"))?.includes("w-16") ?? false;
  }
}
