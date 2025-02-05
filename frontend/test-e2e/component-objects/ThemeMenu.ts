// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";
import { getI18nString } from "~/utils/enUs";

export const newThemeMenu = (parent: Page | Locator) => ({
  parent,
  menu: parent.locator(".dropdown-theme").getByRole("menu"),
  toggleOpenButton: parent.getByRole("button", {
    name: new RegExp(
      getI18nString("components.dropdown_theme.open_dropdown_aria_label"),
      "i"
    ),
  }),

  systemThemeOption: parent.getByRole("menuitem", {
    name: new RegExp(
      getI18nString("components.dropdown_theme.system_aria_label"),
      "i"
    ),
  }),

  lightThemeOption: parent.getByRole("menuitem", {
    name: new RegExp(
      getI18nString("components.dropdown_theme.light_aria_label"),
      "i"
    ),
  }),

  darkThemeOption: parent.getByRole("menuitem", {
    name: new RegExp(
      getI18nString("components.dropdown_theme.dark_aria_label"),
      "i"
    ),
  }),
});
