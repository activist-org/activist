// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "~/test-e2e/global-fixtures";
import { newSignInPage } from "~/test-e2e/page-objects/SignInPage";

test.beforeEach(async ({ page }) => {
  await page.goto("/auth/sign-in");
});

test.describe("Sign In Page", { tag: ["@desktop", "@unauth"] }, () => {
  // Override to run without authentication.
  test.use({ storageState: undefined });

  // Explicitly clear all cookies to ensure unauthenticated state.
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("User can go to Sign Up page", async ({ page }) => {
    const signInPage = newSignInPage(page);

    await signInPage.signUpLink.click();
    await page.waitForURL("**/auth/sign-up");

    expect(page.url()).toContain("/auth/sign-up");
  });
});
