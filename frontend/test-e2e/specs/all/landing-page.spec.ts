import { expect, test } from "playwright/test";
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";

test.beforeEach(async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /where we start/i
  );
});

// Desktop & Mobile
test.describe("Landing Page", { tag: ["@desktop", "@mobile"] }, () => {
  test('Page Title should have text: "activist"', async ({ page }) => {
    expect(await page.title()).toContain("activist");
  });

  // test.skip("User can request access", async ({ page }) => {
  //   const requestAccessLink = page.locator("#request-access");
  //   await expect(requestAccessLink).toHaveAttribute(
  //     "href",
  //     "https://app.formbricks.com/s/clvn9ywe21css8wqpt1hee57a"
  //   );
  // });

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

  // MARK: Accessibility

  // Note: Check to make sure that this is eventually done for light and dark modes.
  test("Landing Page has no detectable accessibility issues", async ({
    page,
  }, testInfo) => {
    const violations = await runAccessibilityTest(
      "Landing Page",
      page,
      testInfo
    );
    expect.soft(violations, "Accessibility violations found:").toHaveLength(0);

    if (violations.length > 0) {
      console.log(
        "Accessibility violations:",
        JSON.stringify(violations, null, 2)
      );
    }
  });
});
