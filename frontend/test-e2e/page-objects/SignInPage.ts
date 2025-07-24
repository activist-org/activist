// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

export const newSignInPage = (page: Page) => ({
  signUpLink: page.getByRole("link", {
    name: new RegExp(getEnglishText("i18n._global.sign_up_aria_label"), "i"),
  }),
  usernameInput: page.getByLabel(
    getEnglishText("i18n.pages.auth.sign_in.enter_user_name")
  ),
  passwordInput: page.getByLabel(getEnglishText("i18n._global.enter_password")),
  showPasswordToggle: page.locator("#form-item-password-show-password"),
  captcha: page.locator("#sign-in-captcha"),

  // Currently a button but should be a link
  forgotPasswordLink: page.getByRole("button", {
    name: new RegExp(
      getEnglishText("i18n._global.auth.reset_password_forgot_password"),
      "i"
    ),
  }),

  signInButton: page.getByRole("button", {
    name: getEnglishText("i18n.components.submit_aria_label"),
  }),
});
