import type { Locator, Page } from "playwright";

export const newThemeMenu = (parent: Page | Locator) => ({
  parent,
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
