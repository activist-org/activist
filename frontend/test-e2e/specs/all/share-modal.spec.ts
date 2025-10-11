// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { getEnglishText } from "~/app/utils/i18n";
import { CardConnect } from "~/test-e2e/component-objects/CardConnect";

test.beforeEach(async ({ page }) => {
  await page.goto("/organizations");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /organizations/i
  );

  const firstOrgLink = page
    .getByLabel(
      getEnglishText(
        "i18n.components._global.navigate_to_organization_aria_label"
      )
    )
    .first();

  await firstOrgLink.click();
  await page.waitForURL("**/organizations/**/about");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test.describe(
  "Social Links Functionality",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test("Displays Connect Card with Social Links", async ({ page }) => {
      const connectCard = CardConnect(page);

      await expect(connectCard.root).toBeVisible();
      await expect(connectCard.heading).toBeVisible();

      await expect(connectCard.heading).toHaveText("Connect");

      const socialLinksCount = await connectCard.getSocialLinkCount();

      if (socialLinksCount > 0) {
        const socialLinks = connectCard.getAllSocialLinks();

        for (let i = 0; i < socialLinksCount; i++) {
          const link = socialLinks.nth(i);
          await expect(link).toBeVisible();
          await expect(link).toHaveAttribute("href");

          await expect(link).toBeEnabled();
        }
      }
    });

    test("social links display correct platform icons", async ({ page }) => {
      const connectCard = CardConnect(page);
      const socialLinksCount = await connectCard.getSocialLinkCount();

      if (socialLinksCount > 0) {
        const socialLinks = connectCard.getAllSocialLinks();

        for (let i = 0; i < socialLinksCount; i++) {
          const link = socialLinks.nth(i);
          const href = await link.getAttribute("href");

          if (href) {
            // Verify that each link has an icon (SVG)
            const icon = link.locator("svg").first();
            await expect(icon).toBeVisible();

            // Verify platform-specific characteristics
            if (href.includes("facebook.com")) {
              await expect(link).toContainText(/facebook/i);
            } else if (href.includes("instagram.com")) {
              await expect(link).toContainText(/instagram/i);
            } else if (href.includes("mastodon")) {
              await expect(link).toContainText(/mastodon/i);
            } else if (href.includes("twitter.com") || href.includes("x.com")) {
              await expect(link).toContainText(/twitter|x/i);
            }
          }
        }
      }
    });

    test("social links are keyboard accessible", async ({ page }) => {
      const connectCard = CardConnect(page);
      const socialLinksCount = await connectCard.getSocialLinkCount();

      if (socialLinksCount > 0) {
        const firstLink = connectCard.getAllSocialLinks().first();

        // Test keyboard navigation
        await firstLink.focus();
        await expect(firstLink).toBeFocused();

        // Test Tab navigation to next link if multiple exist
        if (socialLinksCount > 1) {
          await page.keyboard.press("Tab");
          const secondLink = connectCard.getAllSocialLinks().nth(1);
          await expect(secondLink).toBeFocused();
        }
      }
    });

    test("shows edit icon when user is authenticated", async ({ page }) => {
      // Sign in with test credentials
      await page.goto("/auth/sign-in");
      await page.fill('input[type="text"]', "admin");
      await page.fill('input[type="password"]', "admin");
      await page.getByRole("button", { name: "Submit the form" }).click();

      // Wait for successful sign-in and navigate to organization
      await page.waitForURL("/**");
      await page.goto("/organizations");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        /organizations/i
      );

      const firstOrgLink = page
        .getByLabel(
          getEnglishText(
            "i18n.components._global.navigate_to_organization_aria_label"
          )
        )
        .first();

      await firstOrgLink.click();
      await page.waitForURL("**/organizations/**/about");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const connectCard = CardConnect(page);
      await expect(connectCard.root).toBeVisible();

      // Edit button should be visible when authenticated
      await expect(connectCard.editButton).toBeVisible();
    });

    test("opens social links modal when edit button is clicked", async ({
      page,
    }) => {
      // Sign in with test credentials
      await page.goto("/auth/sign-in");
      await page.fill('input[type="text"]', "admin");
      await page.fill('input[type="password"]', "admin");
      await page.getByRole("button", { name: "Submit the form" }).click();

      // Wait for successful sign-in and navigate to organization
      await page.waitForURL("/**");
      await page.goto("/organizations");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        /organizations/i
      );

      const firstOrgLink = page
        .getByLabel(
          getEnglishText(
            "i18n.components._global.navigate_to_organization_aria_label"
          )
        )
        .first();

      await firstOrgLink.click();
      await page.waitForURL("**/organizations/**/about");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const modalEditButton = page.getByTestId("edit-icon");
      await expect(modalEditButton).toBeVisible();
      await modalEditButton.click();

      await expect(
        page.getByRole("heading", { name: "Social links" })
      ).toBeVisible();

      // const organizationPage = newOrganizationPage(page);
      // await organizationPage.waitForPageLoad();

      // // Open social links modal
      // if ((await organizationPage.connectCard.editButton.count()) > 0) {
      //   await organizationPage.openSocialLinksModal();
      //   await expect(organizationPage.socialLinksModal.root).toBeVisible();
      //   await expect(organizationPage.socialLinksModal.heading).toBeVisible();
      // }
    });
  }
);
