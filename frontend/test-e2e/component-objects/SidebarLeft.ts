// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

import { getEnglishText } from "#shared/utils/i18n";
import { expect } from "playwright/test";

export const newSidebarLeft = (page: Page) => {
  // Private state patterns in closure and locators.
  const collapsed = /w-20|w-16/;
  const expanded = /w-60|w-56/;
  const locked = /-rotate-180/;

  const root = page.locator("#sidebar-left");
  const lockToggle = root.getByRole("button", {
    name: new RegExp(
      getEnglishText(
        "i18n.components.sidebar_left_header.sidebar_collapse_aria_label"
      ),
      "i"
    ),
  });

  return {
    // MARK: Public Locators
    root,
    lockToggle,

    // MARK: State Check Methods

    async isCollapsed(): Promise<boolean> {
      const classes = (await root.getAttribute("class")) ?? "";
      return collapsed.test(classes);
    },

    async expectIsCollapsed(message?: string) {
      await expect(root, message).toHaveClass(collapsed);
    },

    async isExpanded(): Promise<boolean> {
      const classString = (await root.getAttribute("class")) ?? "";
      return expanded.test(classString);
    },

    async expectIsExpanded(message?: string) {
      await expect(root, message).toHaveClass(expanded);
    },

    async isLockedOpen(): Promise<boolean> {
      const classString = (await lockToggle.getAttribute("class")) ?? "";
      return locked.test(classString);
    },

    async expectIsLockedOpen(message?: string) {
      await expect(lockToggle, message).toHaveClass(locked);
    },

    async isUnlocked(): Promise<boolean> {
      const classString = (await lockToggle.getAttribute("class")) ?? "";
      return !locked.test(classString);
    },

    async expectIsUnlocked(message?: string) {
      await expect(lockToggle, message).not.toHaveClass(locked);
    },

    // MARK: Interaction Methods

    async hover(): Promise<void> {
      await root.hover();
    },

    async mouseEnter(): Promise<void> {
      // Determine the the width of the visible sidebar.
      const boundingBox = await root.boundingBox();
      const x = boundingBox?.x ?? 0;
      const y = boundingBox?.y ?? 0;
      // Move mouse to the center of the sidebar.
      await page.mouse.move(x / 2, y / 2);
    },

    // Hover to the right of the sidebar left.
    async mouseLeave(): Promise<void> {
      const boundingBox = await root.boundingBox();
      if (!boundingBox) {
        throw new Error("Unable to get bounding box of SidebarLeft");
      }

      const { x, y, width, height } = boundingBox;

      // Move the mouse to the right of the sidebar.
      const outsideX = x + width + 100; // 10 pixels to the right of the sidebar
      const outsideY = y + height / 2; // vertically centered

      await page.mouse.move(outsideX, outsideY);
    },

    async open(): Promise<void> {
      await this.mouseEnter();
      await this.expectIsExpanded();
    },

    /**
     * Has assertions to wait for unlock and collapse actions to complete.
     */
    async close(): Promise<void> {
      const isLockedOpen =
        (await this.isExpanded()) && (await this.isLockedOpen());
      if (isLockedOpen) {
        await lockToggle.click();
        await this.expectIsUnlocked();
      }
      await this.mouseLeave();
      await this.expectIsCollapsed();
    },
  };
};

export type SidebarLeft = ReturnType<typeof newSidebarLeft>;
