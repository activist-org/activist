// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "#shared/utils/i18n";

// MARK: Request reset email

export const newPasswordResetRequestPage = (page: Page) => ({
  emailInput: page.getByLabel(
    getEnglishText("i18n.pages.auth._global.enter_email")
  ),
  submitButton: page.locator("#sign-in-submit"),
});

// MARK: Set new password (pwreset code)

export const newPasswordResetCodePage = (page: Page) => ({
  passwordInput: page.getByLabel(getEnglishText("i18n._global.enter_password")),
  repeatPasswordInput: page.getByLabel(
    getEnglishText("i18n._global.repeat_password")
  ),
  submitButton: page.locator("#reset-password-submit"),
});

// MARK: Reset password index (legacy partial UI)

export const newResetPasswordIndexPage = (page: Page) => ({
  usernameOrEmailInput: page.locator("#reset-password-username"),
  submitButton: page.getByRole("button", {
    name: new RegExp(getEnglishText("i18n._global.auth.reset_password"), "i"),
  }),
  backToSignInLink: page.getByRole("link", {
    name: new RegExp(
      getEnglishText("i18n.pages.auth.reset_password.index.back_to_sign_in"),
      "i"
    ),
  }),
});
