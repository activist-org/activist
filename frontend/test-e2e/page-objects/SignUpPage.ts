// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "#shared/utils/i18n";

export const newSignUpPage = (page: Page) => ({
  usernameInput: page.getByLabel(
    getEnglishText("i18n.pages.auth._global.enter_a_user_name")
  ),
  emailInput: page.getByLabel(
    getEnglishText("i18n.pages.auth._global.enter_email")
  ),
  passwordInput: page
    .getByLabel(getEnglishText("i18n._global.enter_password"))
    .first(),
  repeatPasswordInput: page.getByLabel(
    getEnglishText("i18n._global.repeat_password")
  ),
  showPasswordToggle: page.getByTestId("form-item-password-show-password"),
  showRepeatPasswordToggle: page.getByTestId(
    "form-item-confirmPassword-show-password"
  ),
  captcha: page.getByRole("button", {
    name: new RegExp(
      getEnglishText(
        "i18n.components.friendly_captcha.dev_captcha_disabled_aria_label"
      ),
      "i"
    ),
  }),
  termsCheckbox: page.getByRole("checkbox"),
  submitButton: page.getByRole("button", {
    name: getEnglishText("i18n.components.submit_aria_label"),
  }),
  signInLink: page.getByRole("link", {
    name: getEnglishText("i18n._global.sign_in"),
    exact: true,
  }),
});
