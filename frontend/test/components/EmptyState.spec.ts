// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import EmptyState from "../../app/components/EmptyState.vue";
import render from "../render";

const stubs = {
  PageContent: {
    template: "<div><slot /></div>",
  },
  PageCommunityFooter: {
    template: "<div><slot /></div>",
  },
  BtnRouteInternal: {
    template: '<a :href="linkTo" :aria-label="ariaLabel" />',
    props: ["linkTo", "ariaLabel", "label", "cta", "fontSize"],
  },
};

describe("EmptyState", () => {
  it("renders the empty state container", async () => {
    await render(EmptyState, {
      props: { pageType: "organizations", permission: true },
      global: { stubs },
    });

    expect(screen.getByTestId("empty-state")).toBeTruthy();
  });

  describe("pageType headers", () => {
    const pageTypes = [
      "organizations",
      "groups",
      "events",
      "resources",
      "faq",
      "team",
      "affiliates",
      "tasks",
      "discussions",
    ] as const;

    it.each(pageTypes)(
      'renders a heading for pageType "%s"',
      async (pageType) => {
        await render(EmptyState, {
          props: { pageType, permission: true },
          global: { stubs },
        });

        expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
      }
    );
  });

  describe("permission prop", () => {
    it("shows return home link when permission is false", async () => {
      await render(EmptyState, {
        props: { pageType: "organizations", permission: false },
        global: { stubs },
      });

      const links = screen.getAllByRole("link");
      expect(links.some((l) => l.getAttribute("href") === "/home")).toBe(true);
    });

    it("shows create organization link when pageType is organizations and has permission", async () => {
      await render(EmptyState, {
        props: { pageType: "organizations", permission: true },
        global: { stubs },
      });

      const links = screen.getAllByRole("link");
      expect(
        links.some((l) => l.getAttribute("href") === "/organizations/create")
      ).toBe(true);
    });

    it("shows create group link when pageType is groups and has permission", async () => {
      await render(EmptyState, {
        props: { pageType: "groups", permission: true },
        global: { stubs },
      });

      const links = screen.getAllByRole("link");
      expect(
        links.some((l) => l.getAttribute("href") === "/groups/create")
      ).toBe(true);
    });

    it("shows create event link when pageType is events and has permission", async () => {
      await render(EmptyState, {
        props: { pageType: "events", permission: true },
        global: { stubs },
      });

      const links = screen.getAllByRole("link");
      expect(
        links.some((l) => l.getAttribute("href") === "/events/create")
      ).toBe(true);
    });

    it("shows create resource link when pageType is resources and has permission", async () => {
      await render(EmptyState, {
        props: { pageType: "resources", permission: true },
        global: { stubs },
      });

      const links = screen.getAllByRole("link");
      expect(
        links.some((l) => l.getAttribute("href") === "/resources/create")
      ).toBe(true);
    });

    it("does not show a create link when pageType has no create action", async () => {
      await render(EmptyState, {
        props: { pageType: "faq", permission: true },
        global: { stubs },
      });

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0].getAttribute("href")).toBe("/home");
    });
  });
});
