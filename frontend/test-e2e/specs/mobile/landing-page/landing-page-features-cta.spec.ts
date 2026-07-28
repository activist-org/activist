// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";
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

    // These links point to docs.activist.org, so we assert the href instead
    // of navigating there: a real click would make the test depend on that
    // site being up and fast, not on anything this app controls.

    test("Become a Supporter button links to the support-us page", async ({
      page,
    }) => {
      const href = await page
        .getByRole("link", { name: OUR_SUPPORTERS_BECOME_LINK_NAME })
        .getAttribute("href");

      expect(href).toBe("https://docs.activist.org/activist/welcome/support-us");
    });

    test("View all Supporters button links to the supporters page", async ({
      page,
    }) => {
      const href = await page
        .getByRole("link", { name: OUR_SUPPORTERS_VIEW_LINK_NAME })
        .getAttribute("href");

      expect(href).toBe(
        "https://docs.activist.org/activist/organization/community/supporters"
      );
    });

    // MARK: Footer Links

    test("Roadmap footer link points to the roadmap page", async ({
      page,
    }) => {
      const href = await page
        .getByRole("link", { name: FOOTER_ROADMAP_LINK_NAME })
        .getAttribute("href");

      expect(href).toBe(
        "https://docs.activist.org/activist/product/about/roadmap"
      );
    });

    test("Trademark footer link points to the trademark page", async ({
      page,
    }) => {
      const href = await page
        .getByRole("link", { name: FOOTER_TRADEMARK_LINK_NAME })
        .getAttribute("href");

      expect(href).toBe(
        "https://docs.activist.org/activist/organization/legal/trademark"
      );
    });

    test("Privacy Policy footer link points to the privacy policy page", async ({
      page,
    }) => {
      const href = await page
        .getByRole("link", { name: FOOTER_PRIVACY_LINK_NAME })
        .getAttribute("href");

      expect(href).toBe(
        "https://docs.activist.org/activist/product/data-and-security/privacy-policy"
      );
    });

    test("Imprint footer link points to the imprint page", async ({
      page,
    }) => {
      const href = await page
        .getByRole("link", { name: FOOTER_IMPRINT_LINK_NAME })
        .getAttribute("href");

      expect(href).toBe(
        "https://docs.activist.org/activist/organization/legal/imprint"
      );
    });

    test("Documentation footer link points to the docs site", async ({
      page,
    }) => {
      const href = await page
        .getByRole("link", { name: FOOTER_DOCUMENTATION_LINK_NAME })
        .getAttribute("href");

      expect(href).toBe("https://docs.activist.org/activist");
    });

    test("About footer link points to the community page", async ({
      page,
    }) => {
      const href = await page
        .getByRole("link", { name: FOOTER_ABOUT_LINK_NAME })
        .getAttribute("href");

      expect(href).toBe(
        "https://docs.activist.org/activist/organization/community"
      );
    });

    test("Supporters footer link points to the supporters page", async ({
      page,
    }) => {
      const href = await page
        .getByRole("link", { name: FOOTER_SUPPORTERS_LINK_NAME })
        .getAttribute("href");

      expect(href).toBe(
        "https://docs.activist.org/activist/organization/community/supporters"
      );
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
