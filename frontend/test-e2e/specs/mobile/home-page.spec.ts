// SPDX-License-Identifier: AGPL-3.0-or-later
import { newInfoMenu } from "~/test-e2e/component-objects/InfoMenu";
import { newMainNavOptions } from "~/test-e2e/component-objects/MainNavOptions";
import { newSearchbar } from "~/test-e2e/component-objects/Searchbar";
import { newSidebarRight } from "~/test-e2e/component-objects/SidebarRight";
import { newSignInMenu } from "~/test-e2e/component-objects/SignInMenu";
import { expect, test } from "~/test-e2e/global-fixtures";

test.beforeEach(async ({ page }) => {
  await page.goto("/home");
});

test.describe("Home Page", { tag: ["@mobile", "@unauth"] }, () => {
  // Override to run without authentication (tests sign-in menu).
  test.use({ storageState: undefined });

  // Explicitly clear all cookies to ensure unauthenticated state.
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("User can open searchbar", async ({ page }) => {
    const searchbar = newSearchbar(page);

    await searchbar.openToggle.click();
    await expect(searchbar.input).toHaveAttribute("placeholder", /search/i);

    await searchbar.openToggle.click();
    await expect(searchbar.input).not.toBeVisible();
  });

  test("Navigation main options: Home, Events, and Organizations", async ({
    page,
  }) => {
    const { homeLink, eventsLink, organizationsLink } = newMainNavOptions(page);

    const links = [
      { link: eventsLink, path: "/events" },
      { link: organizationsLink, path: "/organizations" },
      { link: homeLink, path: "/home" },
    ];

    for (const { link, path } of links) {
      // Use evaluate to click directly in browser context, bypassing overlays.
      await link.evaluate((element: HTMLElement) => {
        element.click();
      });

      await page.waitForURL(`**${path}`);
      expect(page.url()).toContain(path);

      await page.goto("/home");
    }
  });

  test("Navigation submenus: Info and Join activist", async ({ page }) => {
    const sidebarRight = newSidebarRight(page);
    const infoMenu = newInfoMenu(page);
    const signInMenu = newSignInMenu(page);
    const submenus = [
      {
        submenu: infoMenu,
        options: [
          { link: infoMenu.helpOption, path: "/help" },
          { link: infoMenu.documentationOption, path: "/docs" },
          { link: infoMenu.legalOption, path: "/legal" },
        ],
      },
      {
        submenu: signInMenu,
        options: [
          { link: signInMenu.signInOption, path: "/auth/sign-in" },
          { link: signInMenu.signUpOption, path: "/auth/sign-up" },
        ],
      },
    ];

    for (const { submenu, options } of submenus) {
      for (const { link, path } of options) {
        await sidebarRight.openButton.click();
        await submenu.toggleOpenButton.click();
        await link.click();

        await page.waitForURL(`**${path}`);
        expect(page.url()).toContain(path);

        await page.goto("/home");
      }
    }
  });
});
