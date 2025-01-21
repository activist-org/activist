// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /where we start/i
  );
});

// MARK: Desktop & Mobile

test.describe("Landing Page", { tag: ["@desktop", "@mobile"] }, () => {
  test('Page Title should have text: "activist"', async ({ page }) => {
    expect(await page.title()).toContain("activist");
  });

  test("User can request access", async ({ page }) => {
    const requestAccessLink = page.locator("#request-access");
    await expect(requestAccessLink).toHaveAttribute(
      "href",
      /^https:\/\/forms.activist.org\/s\/.*$/
    );
  });

  test("User can go to Organizations page", async ({ page }) => {
    const organizationsLink = page.getByRole("link", {
      name: /view the organizations section of the activist platform/i,
    });
    await organizationsLink.click();
    await page.waitForURL("**/organizations");
    expect(page.url()).toContain("/organizations");
  });

  test("User can go to Events page", async ({ page }) => {
    const eventsLink = page.getByRole("link", {
      name: /view the events section of the activist platform/i,
    });
    await eventsLink.click();
    await page.waitForURL("**/events");
    expect(page.url()).toContain("/events");
  });

  test("Important links have correct urls", async ({ page }) => {
    const links = [
      {
        name: /learn more about getting involved in an activist organization/i,
        url: "https://docs.activist.org/activist",
      },
      {
        name: /learn more about organizing an activist organization/i,
        url: "https://docs.activist.org/activist",
      },
      {
        name: /learn more about growing an activist organization/i,
        url: "https://docs.activist.org/activist",
      },
      {
        name: /learn more about activist\.org and how it functions/i,
        url: "https://docs.activist.org/activist",
      },
      {
        name: /become a supporter of activist/i,
        url: "/supporters/join",
      },
      {
        name: /view all supporters of activist/i,
        url: "https://docs.activist.org/activist/organization/community/supporters",
      },
    ];

    for (const { name, url } of links) {
      const link = page.getByRole("link", { name });
      await expect(link).toHaveAttribute("href", url);
    }
  });
});
