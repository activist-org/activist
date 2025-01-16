// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

export const newEntityMenu = (parent: Page | Locator, prefix: string) => ({
  toggleOpenButton: parent.locator("#submenu"),
  aboutOption: parent.locator(`#${prefix}-about`),
  teamOption: parent.locator(`#${prefix}-team`),
  resourcesOption: parent.locator(`#${prefix}-resources`),
  tasksOption: parent.locator(`#${prefix}-tasks`),
  discussionsOption: parent.locator(`${prefix}-discussion`),
  settingsOption: parent.locator(`#${prefix}-settings`),
});
