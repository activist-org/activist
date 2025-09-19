// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

import { expect } from "playwright/test";

import { newSignInPage } from "~/test-e2e/page-objects/SignInPage";

/**
 * Sign in as admin user and navigate to home page
 * @param page - Playwright page object
 * @param username - Username (defaults to "admin")
 * @param password - Password (defaults to "admin")
 */
export async function signInAsAdmin(
  page: Page,
  username: string = "admin",
  password: string = "admin"
) {
  // Navigate to sign-in page
  await page.goto("/auth/sign-in");
  const signInPage = newSignInPage(page);

  // Fill credentials and submit
  await signInPage.usernameInput.fill(username);
  await signInPage.passwordInput.fill(password);
  await signInPage.signInButton.click();

  // Wait for successful navigation to home page
  await page.waitForURL("**/home");
  await expect(page).toHaveURL(/.*\/home/);
}

/**
 * Sign in with custom credentials
 * @param page - Playwright page object
 * @param username - Username
 * @param password - Password
 * @param expectedRedirect - Expected URL pattern after successful sign-in (defaults to home)
 */
export async function signIn(
  page: Page,
  username: string,
  password: string,
  expectedRedirect: string = "**/home"
) {
  // Navigate to sign-in page
  await page.goto("/auth/sign-in");
  const signInPage = newSignInPage(page);

  // Fill credentials and submit
  await signInPage.usernameInput.fill(username);
  await signInPage.passwordInput.fill(password);
  await signInPage.signInButton.click();

  // Wait for successful navigation
  await page.waitForURL(expectedRedirect);
}
