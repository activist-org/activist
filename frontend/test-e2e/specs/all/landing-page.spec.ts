// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";
import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    new RegExp(getEnglishText("i18n.components.landing_splash.header"), "i")
  );
});

// MARK: Desktop & Mobile

test.describe("Landing Page", { tag: ["@desktop", "@mobile"] }, () => {
  test(
    "Landing Page has no detectable accessibility issues",
    { tag: "@accessibility" },
    async ({ page }, testInfo) => {
      logTestPath(testInfo);

      await withTestStep(
        testInfo,
        "Wait for lang attribute to be set",
        async () => {
          await expect(page.locator("html")).toHaveAttribute(
            "lang",
            /^[a-z]{2}(-[A-Z]{2})?$/
          );
        }
      );

      await withTestStep(testInfo, "Run accessibility scan", async () => {
        const violations = await runAccessibilityTest(
          "Landing Page",
          page,
          testInfo
        );
        expect
          .soft(violations, "Accessibility violations found:")
          .toHaveLength(0);

        if (violations.length > 0) {
          // Note: For future implementation.
        }
      });
    }
  );

  test('Page Title should have text: "activist"', async ({ page }) => {
    expect(await page.title()).toContain("activist");
  });

  test("User can go to Organizations page", async ({ page }, testInfo) => {
    logTestPath(testInfo);

    await withTestStep(testInfo, "Click organizations link", async () => {
      const organizationsLink = page.getByRole("link", {
        name: new RegExp(
          getEnglishText(
            "i18n.components.landing_splash.view_organizations_aria_label"
          ),
          "i"
        ),
      });
      await organizationsLink.click();
    });

    await withTestStep(
      testInfo,
      "Verify navigation to organizations page",
      async () => {
        await page.waitForURL("**/organizations");
        expect(page.url()).toContain("/organizations");
      }
    );
  });

  test("User can go to Events page", async ({ page }, testInfo) => {
    logTestPath(testInfo);

    await withTestStep(testInfo, "Click events link", async () => {
      const eventsLink = page.getByRole("link", {
        name: new RegExp(
          getEnglishText(
            "i18n.components.landing_splash.view_events_aria_label"
          ),
          "i"
        ),
      });
      await eventsLink.click();
    });

    await withTestStep(
      testInfo,
      "Verify navigation to events page",
      async () => {
        await page.waitForURL("**/events");
        expect(page.url()).toContain("/events");
      }
    );
  });

  test("Important links have correct urls", async ({ page }) => {
    const links = [
      {
        name: new RegExp(
          getEnglishText("i18n.pages.index.get_active_aria_label"),
          "i"
        ),
        url: "https://docs.activist.org/activist",
      },

      {
        name: new RegExp(
          getEnglishText("i18n.pages.index.get_organized_aria_label"),
          "i"
        ),
        url: "https://docs.activist.org/activist",
      },

      {
        name: new RegExp(
          getEnglishText("i18n.pages.index.grow_organization_aria_label"),
          "i"
        ),
        url: "https://docs.activist.org/activist",
      },

      {
        name: new RegExp(
          getEnglishText("i18n.pages.index.activist_section_btn_aria_label"),
          "i"
        ),
        url: "https://docs.activist.org/activist",
      },

      {
        name: new RegExp(
          getEnglishText(
            "i18n.pages.index.our_supporters_btn_become_aria_label"
          ),
          "i"
        ),
        url: "https://docs.activist.org/activist/welcome/support-us",
      },

      {
        name: new RegExp(
          getEnglishText("i18n.pages.index.our_supporters_btn_view_aria_label"),
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
