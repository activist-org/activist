// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

export const newSearchbar = (parent: Page | Locator) => ({
  root: parent.locator("#search"),
  openToggle: parent.locator("#search-toggle"),
  input: parent.locator("#input-search"),
});
