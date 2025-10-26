// SPDX-License-Identifier: AGPL-3.0-or-later
import { newSidebarRight } from "~/test-e2e/component-objects/SidebarRight";
import { newSignInMenu } from "~/test-e2e/component-objects/SignInMenu";
import { expect, test } from "~/test-e2e/global-fixtures";

test.beforeEach(async ({ page }) => {
  await page.goto("/auth/sign-in");
});

test.describe("Sign In Page", { tag: ["@mobile", "@unauth"] }, () => {
  // Override to run without authentication.
  test.use({ storageState: undefined });

  // Explicitly clear all cookies to ensure unauthenticated state.
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("User can go to Sign Up page", async ({ page }) => {
    const sidebarRight = newSidebarRight(page);
    const signInMenu = newSignInMenu(page);

    await sidebarRight.openButton.click();
    await signInMenu.toggleOpenButton.click();
    await signInMenu.signUpOption.click();
    await page.waitForURL("**/auth/sign-up");

    expect(page.url()).toContain("/auth/sign-up");
  });
});
