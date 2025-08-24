// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

export const newConnectCard = (parent: Page | Locator) => {
  const root = parent.locator(".card-style").filter({ hasText: "Connect" });

  return {
    root,
    heading: root.getByRole("heading", { name: /connect/i }),
    editButton: root.locator('svg[role="img"]').first(), // Edit icon is first SVG
    socialLinks: root.getByRole("link"),
    socialLinksList: root.locator("ul"),

    // Specific social media links
    facebookLink: root.getByRole("link", { name: /facebook/i }),
    instagramLink: root.getByRole("link", { name: /instagram/i }),
    mastodonLink: root.getByRole("link", { name: /mastodon/i }),
    twitterLink: root.getByRole("link", { name: /twitter/i }),

    // Helper methods
    getSocialLinkByPlatform: (platform: string) =>
      root.getByRole("link", { name: new RegExp(platform, "i") }),
    getAllSocialLinks: () => root.getByRole("link"),
    getSocialLinkCount: async () => {
      const links = root.getByRole("link");
      return await links.count();
    },
  };
};
