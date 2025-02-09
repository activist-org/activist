// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSearchbar } from "~/test-e2e/component-objects/Searchbar";
import { pressControlKey } from "~/test-e2e/actions/keyboard";

test.beforeEach(async ({ page }) => {
  await page.goto("/organizations");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /organizations/i
  );
});

test.describe("Organizations Page", { tag: "@desktop" }, () => {
  test("User can open searchbar from left sidebar", async ({ page }) => {
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
});
