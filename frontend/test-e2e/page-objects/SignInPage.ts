// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";
import { getI18nString } from "~/utils/enUs";

export const newSignInPage = (page: Page) => ({
  signUpLink: page.getByRole("link", {
    name: new RegExp(getI18nString("_global.auth.sign_up_aria_label"), "i"),
  }),
  usernameInput: page.locator("#sign-in-username input"),
  passwordInput: page.locator("#sign-in-password input"),
  showPasswordToggle: page.locator("#sign-in-password span[role='button']"),
  captcha: page.locator("#sign-in-captcha"),

  // Currently a button but should be a link
  forgotPasswordLink: page.getByRole("button", {
    name: new RegExp(
      getI18nString("_global.auth.reset_password_forgot_password"),
      "i"
    ),
  }),

  signInButton: page.getByRole("button", {
    name: new RegExp(getI18nString("_global.sign_in_aria_label"), "i"),
  }),
});
