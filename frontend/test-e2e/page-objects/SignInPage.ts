// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

export const newSignInPage = (page: Page) => ({
  signUpLink: page.getByRole("link", {
    name: /navigate to the sign up page/i,
  }),
  usernameInput: page.locator("#sign-in-username input"),
  passwordInput: page.locator("#sign-in-password input"),
  showPasswordToggle: page.locator("#sign-in-password span[role='button']"),
  captcha: page.locator("#sign-in-captcha"),

  // Currently a button but should be a link
  forgotPasswordLink: page.getByRole("button", {
    name: /forgot your password\?/i,
  }),

  signInButton: page.getByRole("button", {
    name: /sign in to your account/i,
  }),
});
