// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import OrganizationIndexPage from "../../../app/pages/organizations/[orgId]/index.vue";
import render from "../../render";

const { mockNavigateTo, routeState } = vi.hoisted(() => ({
  mockNavigateTo: vi.fn(),
  routeState: {
    params: { orgId: "org-123" } as Record<string, unknown>,
    query: {} as Record<string, unknown>,
    path: "/en/organizations/org-123",
    name: "organizations-orgId",
  },
}));

mockNuxtImport("navigateTo", () => mockNavigateTo);
mockNuxtImport("useRoute", () => () => routeState);
mockNuxtImport("useGetOrganization", async () => {
  const { ref } = await import("vue");
  // Simulate a direct load where the organization query has not resolved yet.
  return () => ({
    data: ref(null),
    pending: ref(true),
    error: ref(null),
    refresh: vi.fn(),
  });
});
mockNuxtImport("useMenuEntriesState", () => () => ({
  organizationEntry: { value: [] },
}));

const stubs = {
  Head: { template: "<div><slot /></div>" },
  Title: { template: "<div><slot /></div>" },
  ImageOrganization: true,
  MenuLinkWrapper: { template: "<div><slot /></div>" },
  BtnRouteInternal: true,
};

describe("organization index page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routeState.params = { orgId: "org-123" };
    routeState.path = "/en/organizations/org-123";
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      configurable: true,
      writable: true,
    });
  });

  it("redirects to the about page using the route param before the query resolves", async () => {
    await render(OrganizationIndexPage, { global: { stubs } });

    expect(mockNavigateTo).toHaveBeenCalledWith(
      "/en/organizations/org-123/about"
    );
    expect(mockNavigateTo.mock.calls[0]?.[0]).not.toContain("undefined");
  });

  it("does not redirect when already on the about page", async () => {
    routeState.path = "/en/organizations/org-123/about";

    await render(OrganizationIndexPage, { global: { stubs } });

    expect(mockNavigateTo).not.toHaveBeenCalled();
  });

  it("renders the org index page and does not redirect at a small mobile viewport width", async () => {
    Object.defineProperty(window, "innerWidth", {
      value: 500,
      configurable: true,
      writable: true,
    });

    const wrapper = await render(OrganizationIndexPage, { global: { stubs } });

    expect(mockNavigateTo).not.toHaveBeenCalled();
    expect(
      wrapper.container.querySelector(
        ".flex.flex-col.items-center.justify-between.gap-8"
      )
    ).toBeTruthy();
    expect(wrapper.container.querySelectorAll("h1").length).toBeGreaterThan(0);
    expect(wrapper.container.querySelectorAll("h2").length).toBeGreaterThan(0);
  });

  it("redirects the org base route to the about page at the mobile/large breakpoint boundary (640px)", async () => {
    Object.defineProperty(window, "innerWidth", {
      value: 640,
      configurable: true,
      writable: true,
    });

    await render(OrganizationIndexPage, { global: { stubs } });

    expect(mockNavigateTo).toHaveBeenCalledWith(
      "/en/organizations/org-123/about"
    );
  });

  it("redirects the org base route to the about page above the mobile breakpoint (768px)", async () => {
    Object.defineProperty(window, "innerWidth", {
      value: 768,
      configurable: true,
      writable: true,
    });

    await render(OrganizationIndexPage, { global: { stubs } });

    expect(mockNavigateTo).toHaveBeenCalledWith(
      "/en/organizations/org-123/about"
    );
  });
});
