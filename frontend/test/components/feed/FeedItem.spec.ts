// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FeedItem from "../../../app/components/feed/FeedItem.vue";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../render";

beforeEach(() => {
  vi.stubGlobal("useLocalePath", () => (path: string) => path);
});

describe("FeedItem", () => {
  it("renders the name as the title", async () => {
    await render(FeedItem, {
      props: { name: "Local Chapter", url: "/organizations/org-1/groups/group-1/about" },
    });

    expect(screen.getByText("Local Chapter")).toBeTruthy();
  });

  it("links to the given url", async () => {
    const { container } = await render(FeedItem, {
      props: { name: "Local Chapter", url: "/organizations/org-1/groups/group-1/about" },
    });

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe(
      "/organizations/org-1/groups/group-1/about"
    );
    expect(link?.getAttribute("aria-label")).toBe(
      getEnglishText("i18n.components._global.navigate_to_group_aria_label")
    );
  });

  it("shows the people icon when the url is an activist.org link", async () => {
    await render(FeedItem, {
      props: {
        name: "Local Chapter",
        url: "https://activist.org/organizations/org-1/groups/group-1/about",
      },
    });

    expect(screen.getByRole("img", { name: "bi:people" })).toBeTruthy();
  });

  it("shows the mastodon icon for a mastodon link", async () => {
    await render(FeedItem, {
      props: { name: "Our Mastodon", url: "https://mastodon.social/@ourorg" },
    });

    expect(
      screen.getByRole("img", { name: "simple-icons:mastodon" })
    ).toBeTruthy();
  });

  it("shows the facebook icon for a facebook link", async () => {
    await render(FeedItem, {
      props: { name: "Our Facebook", url: "https://facebook.com/ourorg" },
    });

    expect(
      screen.getByRole("img", { name: "simple-icons:facebook" })
    ).toBeTruthy();
  });

  it("shows the instagram icon for an instagram link", async () => {
    await render(FeedItem, {
      props: { name: "Our Instagram", url: "https://instagram.com/ourorg" },
    });

    expect(
      screen.getByRole("img", { name: "simple-icons:instagram" })
    ).toBeTruthy();
  });

  it("shows the fallback group icon in the image area when there is no imgUrl", async () => {
    await render(FeedItem, {
      props: {
        name: "Local Chapter",
        url: "/organizations/org-1/groups/group-1/about",
      },
    });

    expect(screen.getByRole("img", { name: "IconGroup" })).toBeTruthy();
  });
});
