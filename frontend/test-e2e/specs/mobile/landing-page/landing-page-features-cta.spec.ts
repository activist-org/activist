// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  FOOTER_ABOUT_LINK_NAME,
  FOOTER_DOCUMENTATION_LINK_NAME,
  FOOTER_IMPRINT_LINK_NAME,
  FOOTER_PRIVACY_LINK_NAME,
  FOOTER_ROADMAP_LINK_NAME,
  FOOTER_SUPPORTERS_LINK_NAME,
  FOOTER_TRADEMARK_LINK_NAME,
  OUR_SUPPORTERS_BECOME_LINK_NAME,
  OUR_SUPPORTERS_VIEW_LINK_NAME,
} from "~/test-e2e/accessibility/accessible-names";
import { expect, test } from "~/test-e2e/global-fixtures";
import { getEnglishText } from "#shared/utils/i18n";

test.describe(
  "Landing Page - Features & CTA",
  { tag: ["@mobile", "@unauth"] },
  () => {
    // Override to run without authentication (landing page for unauthenticated users).
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page, context }) => {
      // Clear all cookies and local storage to ensure completely unauthenticated state.
      await context.clearCookies();
      await page.goto("/en");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        new RegExp(getEnglishText("i18n.components.landing_splash.header"), "i")
      );
    });

    // MARK: Supporter Links

    test("User can go to Support Us page from Become a Supporter button", async ({
      page,
    }) => {
      await page
        .getByRole("link", { name: OUR_SUPPORTERS_BECOME_LINK_NAME })
        .click();
      await page.waitForURL("**/welcome/support-us");

      expect(page.url()).toContain("/welcome/support-us");
    });

    test("User can go to Supporters page from View all Supporters button", async ({
      page,
    }) => {
      await page
        .getByRole("link", { name: OUR_SUPPORTERS_VIEW_LINK_NAME })
        .click();
      await page.waitForURL("**/organization/community/supporters");

      expect(page.url()).toContain("/organization/community/supporters");
    });

    // MARK: Footer Links

    test("User can go to Roadmap page from Footer link", async ({ page }) => {
      await page.getByRole("link", { name: FOOTER_ROADMAP_LINK_NAME }).click();
      await page.waitForURL("**/product/about/roadmap");

      expect(page.url()).toContain("/product/about/roadmap");
    });

    test("User can go to Trademark page from Footer link", async ({ page }) => {
      await page
        .getByRole("link", { name: FOOTER_TRADEMARK_LINK_NAME })
        .click();
      await page.waitForURL("**/organization/legal/trademark");

      expect(page.url()).toContain("/organization/legal/trademark");
    });

    test("User can go to Privacy Policy page from Footer link", async ({
      page,
    }) => {
      await page.getByRole("link", { name: FOOTER_PRIVACY_LINK_NAME }).click();
      await page.waitForURL("**/product/data-and-security/privacy-policy");

      expect(page.url()).toContain("/product/data-and-security/privacy-policy");
    });

    test("User can go to Imprint page from Footer link", async ({ page }) => {
      await page.getByRole("link", { name: FOOTER_IMPRINT_LINK_NAME }).click();
      await page.waitForURL("**/organization/legal/imprint");

      expect(page.url()).toContain("/organization/legal/imprint");
    });

    test("User can go to Documentation from Footer link", async ({ page }) => {
      await page
        .getByRole("link", { name: FOOTER_DOCUMENTATION_LINK_NAME })
        .click();
      await page.waitForURL("**/activist");

      expect(page.url()).toContain("/activist");
    });

    test("User can go to About page from Footer link", async ({ page }) => {
      await page.getByRole("link", { name: FOOTER_ABOUT_LINK_NAME }).click();
      await page.waitForURL("**/organization/community");

      expect(page.url()).toContain("/organization/community");
    });

    test("User can go to Supporters page from Footer link", async ({
      page,
    }) => {
      await page
        .getByRole("link", { name: FOOTER_SUPPORTERS_LINK_NAME })
        .click();
      await page.waitForURL("**/organization/community/supporters");

      expect(page.url()).toContain("/organization/community/supporters");
    });

    // MARK: Social Links

    // Socials banner, open-source section and footer twice in source code and community section.
    test("There are four links to the activist GitHub on the landing page", async ({
      page,
    }) => {
      const landingPageLinks = page
        .getByRole("link", { name: /.*/ })
        .filter({ hasText: /.*/ });

      const GitHubLinkCount = await landingPageLinks.evaluateAll(
        (links) =>
          links.filter(
            (link) =>
              (link as HTMLAnchorElement).href ===
              "https://github.com/activist-org/activist"
          ).length
      );

      expect(GitHubLinkCount).toBe(4);
    });

    // Socials banner and footer.
    test("There are two links to the activist public Matrix community on the landing page", async ({
      page,
    }) => {
      const landingPageLinks = page
        .getByRole("link", { name: /.*/ })
        .filter({ hasText: /.*/ });

      const MatrixLinkCount = await landingPageLinks.evaluateAll(
        (links) =>
          links.filter((link) =>
            (link as HTMLAnchorElement).href.includes(
              "https://matrix.to/#/#activist_community:matrix.org"
            )
          ).length
      );

      expect(MatrixLinkCount).toBe(2);
    });

    // Socials banner and footer.
    test("There are two links to the activist Instagram on the landing page", async ({
      page,
    }) => {
      const landingPageLinks = page
        .getByRole("link", { name: /.*/ })
        .filter({ hasText: /.*/ });

      const InstagramLinkCount = await landingPageLinks.evaluateAll(
        (links) =>
          links.filter((link) =>
            (link as HTMLAnchorElement).href.includes(
              "https://instagram.com/activist_org"
            )
          ).length
      );
      expect(InstagramLinkCount).toBe(2);
    });
  }
);
