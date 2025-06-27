// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    new RegExp(getEnglishText("i18n._global.header"), "i")
  );
});

// MARK: Desktop & Mobile

test.describe("Landing Page", { tag: ["@desktop", "@mobile"] }, () => {
  test('Page Title should have text: "activist"', async ({ page }) => {
    expect(await page.title()).toContain("activist");
  });

  test("User can go to Organizations page", async ({ page }) => {
    const organizationsLink = page.getByRole("link", {
      name: new RegExp(
        getEnglishText(
          "i18n._global.view_organizations_aria_label"
        ),
        "i"
      ),
    });
    await organizationsLink.click();
    await page.waitForURL("**/organizations");
    expect(page.url()).toContain("/organizations");
  });

  test("User can go to Events page", async ({ page }) => {
    const eventsLink = page.getByRole("link", {
      name: new RegExp(
        getEnglishText("i18n._global.view_events_aria_label"),
        "i"
      ),
    });
    await eventsLink.click();
    await page.waitForURL("**/events");
    expect(page.url()).toContain("/events");
  });

  test("Important links have correct urls", async ({ page }) => {
    const links = [
      {
        name: new RegExp(
          getEnglishText("i18n._global.get_active_aria_label"),
          "i"
        ),
        url: "https://docs.activist.org/activist",
      },

      {
        name: new RegExp(
          getEnglishText("i18n._global.get_organized_aria_label"),
          "i"
        ),
        url: "https://docs.activist.org/activist",
      },

      {
        name: new RegExp(
          getEnglishText("i18n._global.grow_organization_aria_label"),
          "i"
        ),
        url: "https://docs.activist.org/activist",
      },

      {
        name: new RegExp(
          getEnglishText("i18n._global.activist_section_btn_aria_label"),
          "i"
        ),
        url: "https://docs.activist.org/activist",
      },

      {
        name: new RegExp(
          getEnglishText(
            "i18n._global.our_supporters_btn_become_aria_label"
          ),
          "i"
        ),
        url: "https://docs.activist.org/activist/welcome/support-us",
      },

      {
        name: new RegExp(
          getEnglishText("i18n._global.our_supporters_btn_view_aria_label"),
          "i"
        ),
        url: "https://docs.activist.org/activist/organization/community/supporters",
      },
    ];

    for (const { name, url } of links) {
      const link = page.getByRole("link", { name });
      await expect(link).toHaveAttribute("href", url);
    }
  });
});
