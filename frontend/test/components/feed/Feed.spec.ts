// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Feed from "../../../app/components/feed/Feed.vue";
import { createUseRouteMock } from "../../mocks/composableMocks";
import { createMockGroup, createMockOrganization } from "../../mocks/factories";
import render from "../../render";

const stubs = {
  FeedItem: {
    props: ["name", "url"],
    template: '<div data-testid="feed-item">{{ name }}</div>',
  },
};

const { organizationData } = vi.hoisted(() => ({
  organizationData: {
    value: null as ReturnType<typeof createMockOrganization> | null,
  },
}));

mockNuxtImport("useGetOrganization", async () => {
  const { ref } = await import("vue");
  return () => ({ data: ref(organizationData.value) });
});

beforeEach(() => {
  organizationData.value = null;
  vi.stubGlobal("useRoute", createUseRouteMock({ orgId: "org-1" }));
});

describe("Feed", () => {
  it("renders nothing when the organization has no groups", async () => {
    organizationData.value = createMockOrganization({ groups: [] });

    const { container } = await render(Feed, { global: { stubs } });

    expect(container.querySelectorAll("[data-testid='feed-item']").length).toBe(
      0
    );
  });

  it("renders a feed item for each of the organization's groups", async () => {
    organizationData.value = createMockOrganization({
      id: "org-1",
      groups: [
        createMockGroup({ id: "group-1", name: "Local Chapter" }),
        createMockGroup({ id: "group-2", name: "Youth Wing" }),
      ],
    });

    await render(Feed, { global: { stubs } });

    const items = screen.getAllByTestId("feed-item");
    expect(items.length).toBe(2);
    expect(screen.getByText("Local Chapter")).toBeTruthy();
    expect(screen.getByText("Youth Wing")).toBeTruthy();
  });
});
