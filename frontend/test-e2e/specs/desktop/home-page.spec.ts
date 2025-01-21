// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";
import { pressControlKey } from "~/test-e2e/actions/keyboard";
import { newInfoMenu } from "~/test-e2e/component-objects/InfoMenu";
import { newMainNavOptions } from "~/test-e2e/component-objects/MainNavOptions";
import { newSearchbar } from "~/test-e2e/component-objects/Searchbar";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSignInMenu } from "~/test-e2e/component-objects/SignInMenu";

test.beforeEach(async ({ page }) => {
  await page.goto("/home");

  // SidebarLeft automatically expands because the mouse starts in the top left.
  const sidebar = newSidebarLeft(page);
  await expect(sidebar.root).toBeVisible();
});

test.describe("Home Page", { tag: "@desktop" }, () => {
  test("User can open searchbar", async ({ page }) => {
    const sidebarLeft = newSidebarLeft(page);
    const searchbar = newSearchbar(page);

    await sidebarLeft.mouseEnter();
    await expect(searchbar.input).toHaveAttribute("placeholder", /search/i);

    await sidebarLeft.close();
    await expect(searchbar.input).not.toBeAttached();
  });

  test("User can open searchbar with CTRL+'/'", async ({ page }) => {
    const sidebarLeft = newSidebarLeft(page);
    const searchbar = newSearchbar(page);

    await sidebarLeft.close();
    await sidebarLeft.expectIsCollapsed();

    await pressControlKey(page, "/");
    await sidebarLeft.expectIsExpanded("CTRL+'/' should expand left sidebar");
    await sidebarLeft.expectIsLockedOpen(
      "CTRL+'/' should lock left sidebar open"
    );
    await expect(searchbar.input).toBeFocused();

    await sidebarLeft.lockToggle.click();
    await sidebarLeft.mouseLeave();
    await expect(searchbar.input).not.toBeAttached();
  });

  test("Navigation main options: Events and Organizations", async ({
    page,
  }) => {
    const { eventsLink, organizationsLink } = newMainNavOptions(page);

    const links = [
      { link: eventsLink, path: "/events" },
      { link: organizationsLink, path: "/organizations" },
    ];

    for (const { link, path } of links) {
      await link.click();

      await page.waitForURL(`**${path}`);
      expect(page.url()).toContain(path);

      await page.goto("/home");
    }
  });

  test("Navigation submenus: Info and Join activist", async ({ page }) => {
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
        await submenu.toggleOpenButton.click();
        await link.click();

        await page.waitForURL(`**${path}`);
        expect(page.url()).toContain(path);

        await page.goto("/home");
      }
    }
  });

  test("Left Menu should expand, collapse, and lock open", async ({ page }) => {
    const sidebarLeft = newSidebarLeft(page);

    await sidebarLeft.close();

    await sidebarLeft.expectIsCollapsed("should be collapsed");

    await sidebarLeft.mouseEnter();
    await sidebarLeft.expectIsExpanded("should expand on mouse enter");
    await sidebarLeft.expectIsUnlocked("should be unlocked");

    await sidebarLeft.mouseLeave();
    await sidebarLeft.expectIsCollapsed("should collapse on mouse leave");

    await sidebarLeft.mouseEnter();
    await sidebarLeft.expectIsExpanded("should expand on mouse enter");

    await sidebarLeft.lockToggle.click();
    await sidebarLeft.mouseLeave();
    await sidebarLeft.expectIsLockedOpen(
      "lock toggle button should point left when locked"
    );
    await sidebarLeft.expectIsExpanded(
      "should stay expanded on mouse leave when locked"
    );

    await sidebarLeft.mouseEnter();
    await sidebarLeft.lockToggle.click();
    await sidebarLeft.expectIsUnlocked(
      "lock toggle button should point right when unlocked"
    );

    await sidebarLeft.mouseLeave();
    await sidebarLeft.expectIsCollapsed(
      "should collapse on mouse leave when unlocked"
    );
  });
});
