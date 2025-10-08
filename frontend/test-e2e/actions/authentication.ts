// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

import { newSignInPage } from "~/test-e2e/page-objects/SignInPage";

/**
 * Sign in as admin user and navigate to home page
 * @param page - Playwright page object
 * @param username - Username (defaults to "admin")
 * @param password - Password (defaults to "admin")
 * @param skipNavigation - Skip navigation to sign-in page (default: false)
 */
export async function signInAsAdmin(
  page: Page,
  username: string = "admin",
  password: string = "admin",
  skipNavigation: boolean = false
) {
  // Navigate to sign-in page if not already there.
  if (!skipNavigation) {
    await page.goto("/auth/sign-in");
  }

  const signInPage = newSignInPage(page);

  // Wait for page to be ready and fill credentials.
  await signInPage.usernameInput.waitFor({ state: "visible", timeout: 30000 });
  await signInPage.usernameInput.fill(username);
  await signInPage.passwordInput.fill(password);
  await page.waitForTimeout(500);

  // Click CAPTCHA if present.
  const { captcha } = signInPage;
  try {
    if (await captcha.isVisible({ timeout: 2000 })) {
      await captcha.click();
      await page.waitForTimeout(500);
    }
  } catch {
    // CAPTCHA not present, continue.
  }

  // Submit form and wait for successful navigation to home page with explicit timeout.
  await signInPage.signInButton.click();
  await page.waitForURL("**/home", { timeout: 60000 });
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
  // Navigate to sign-in page.
  await page.goto("/auth/sign-in");

  // Wait for page to be ready and fill credentials.
  const signInPage = newSignInPage(page);
  await signInPage.usernameInput.fill(username);
  await signInPage.passwordInput.fill(password);

  // Click CAPTCHA if present.
  const { captcha } = signInPage;
  if (await captcha.isVisible()) {
    await captcha.click();
  }

  // Submit form and wait for successful navigation.
  await signInPage.signInButton.click();
  await page.waitForURL(expectedRedirect);
}
