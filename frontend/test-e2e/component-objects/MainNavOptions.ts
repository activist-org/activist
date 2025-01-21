// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

export const newMainNavOptions = (parent: Page | Locator) => ({
  homeLink: parent.locator("#home"),
  eventsLink: parent.locator("#events"),
  organizationsLink: parent.locator("#organizations"),
});
