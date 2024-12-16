import type { Locator, Page } from "playwright";

export const newSearchModal = (parent: Page | Locator) => {
  const root = parent.locator("#search-modal");

  return {
    root,
    input: root.locator("input"),
    closeButton: root.locator("button"),
  };
};
