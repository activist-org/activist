// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

export const newThemeMenu = (parent: Page | Locator) => ({
  parent,
  menu: parent.locator(".dropdown-theme").getByRole("menu"),
  toggleOpenButton: parent.getByRole("button", {
    name: /open the dropdown to select another theme/i,
  }),
  systemThemeOption: parent.getByRole("menuitem", {
    name: /switch to the system color mode/i,
  }),
  lightThemeOption: parent.getByRole("menuitem", {
    name: /switch to light mode/i,
  }),
  darkThemeOption: parent.getByRole("menuitem", {
    name: /switch to dark mode/i,
  }),
});
