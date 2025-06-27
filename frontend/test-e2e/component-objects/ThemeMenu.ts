// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

import { getEnglishText } from "~/utils/i18n";

export const newThemeMenu = (parent: Page | Locator) => ({
  parent,
  menu: parent.locator(".dropdown-theme").getByRole("menu"),
  toggleOpenButton: parent.getByRole("button", {
    name: new RegExp(
      getEnglishText("i18n.components.dropdown_theme.open_dropdown_aria_label"),
      "i"
    ),
  }),

  systemThemeOption: parent.getByRole("menuitem", {
    name: new RegExp(
      getEnglishText("i18n.components.dropdown_theme.system_aria_label"),
      "i"
    ),
  }),

  lightThemeOption: parent.getByRole("menuitem", {
    name: new RegExp(
      getEnglishText("i18n.components.dropdown_theme.light_aria_label"),
      "i"
    ),
  }),

  darkThemeOption: parent.getByRole("menuitem", {
    name: new RegExp(
      getEnglishText("i18n.components.dropdown_theme.dark_aria_label"),
      "i"
    ),
  }),
});
