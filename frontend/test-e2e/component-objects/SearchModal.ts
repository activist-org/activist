// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

export const newSearchModal = (parent: Page | Locator) => {
  const root = parent.locator("#search-modal");

  return {
    root,
    input: root.locator("input"),
    closeButton: root.locator("button"),
  };
};
