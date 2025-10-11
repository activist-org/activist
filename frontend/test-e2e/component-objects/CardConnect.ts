// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

export const CardConnect = (parent: Page | Locator) => {
  const root = parent.locator(".card-style").filter({ hasText: "Connect" });

  return {
    root,
    heading: root.getByRole("heading", { name: /connect/i }),
    editButton: root.locator("svg[role='img']").first(),
    socialLinks: root.getByRole("link"),
    socialLinksList: root.locator("ul"),

    getAllSocialLinks: () => root.getByRole("link"),
    getSocialLinkCount: async () => {
      const links = root.getByRole("link");
      return await links.count();
    },
  };
};
