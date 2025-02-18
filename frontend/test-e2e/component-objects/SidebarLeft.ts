// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import { getI18nString } from "~/utils/i18n";

export const newSidebarLeft = (page: Page) => new SidebarLeft(page);

export class SidebarLeft {
  public readonly root: Locator;
  public readonly lockToggle: Locator;

  private readonly page;
  private collapsed = /w-20|w-16/;
  private expanded = /w-60|w-56/;
  private locked = /-rotate-180/;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator("#sidebar-left");

    this.lockToggle = this.root.getByRole("button", {
      name: new RegExp(
        getI18nString(
          "components.sidebar_left_header.sidebar_collapse_aria_label"
        ),
        "i"
      ),
    });
  }

  async isCollapsed(): Promise<boolean> {
    const classes = (await this.root.getAttribute("class")) ?? "";
    return this.collapsed.test(classes);
  }

  async expectIsCollapsed(message?: string) {
    await expect(this.root, message).toHaveClass(this.collapsed);
  }

  async isExpanded(): Promise<boolean> {
    const classString = (await this.root.getAttribute("class")) ?? "";
    return this.expanded.test(classString);
  }

  async expectIsExpanded(message?: string) {
    await expect(this.root, message).toHaveClass(this.expanded);
  }

  async isLockedOpen(): Promise<boolean> {
    const classString = (await this.lockToggle.getAttribute("class")) ?? "";
    return this.locked.test(classString);
  }

  async expectIsLockedOpen(message?: string) {
    await expect(this.lockToggle, message).toHaveClass(this.locked);
  }

  async isUnlocked(): Promise<boolean> {
    const classString = (await this.lockToggle.getAttribute("class")) ?? "";
    return !this.locked.test(classString);
  }

  async expectIsUnlocked(message?: string) {
    await expect(this.lockToggle, message).not.toHaveClass(this.locked);
  }

  async hover(): Promise<void> {
    await this.root.hover();
  }

  async mouseEnter(): Promise<void> {
    // Determine the the width of the visible sidebar.
    const boundingBox = await this.root.boundingBox();
    const x = boundingBox?.x ?? 0;
    const y = boundingBox?.y ?? 0;
    // Move mouse to the center of the sidebar.
    await this.page.mouse.move(x / 2, y / 2);
  }

  // Hover to the right of the sidebar left.
  async mouseLeave(): Promise<void> {
    const boundingBox = await this.root.boundingBox();
    if (!boundingBox) {
      throw new Error("Unable to get bounding box of SidebarLeft");
    }

    const { x, y, width, height } = boundingBox;

    // Move the mouse to the right of the sidebar.
    const outsideX = x + width + 100; // 10 pixels to the right of the sidebar
    const outsideY = y + height / 2; // vertically centered

    await this.page.mouse.move(outsideX, outsideY);
  }

  async open(): Promise<void> {
    await this.mouseEnter();
    await this.expectIsExpanded();
  }

  /**
   * Has assertions to wait for unlock and collapse actions to complete.
   */
  async close(): Promise<void> {
    const isLockedOpen =
      (await this.isExpanded()) && (await this.isLockedOpen());
    if (isLockedOpen) {
      await this.lockToggle.click();
      await this.expectIsUnlocked();
    }
    await this.mouseLeave();
    await this.expectIsCollapsed();
  }
}
