import type { Locator, Page } from "playwright";

export const newSignInMenu = (parent: Page | Locator) => ({
  toggleOpenButton: parent.locator("#user-options").getByRole("button", {
    name: /open to see user specific options/i,
  }),
  signInOption: parent.locator("#user-options").getByRole("menuitem", {
    name: /sign in/i,
  }),
  signUpOption: parent.locator("#user-options").getByRole("menuitem", {
    name: /sign up/i,
  }),
});
