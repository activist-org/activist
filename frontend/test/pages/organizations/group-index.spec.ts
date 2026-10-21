// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import OrganizationGroupIndexPage from "../../../app/pages/organizations/[orgId]/groups/[groupId]/index.vue";
import render from "../../render";

const { mockNavigateTo, routeState } = vi.hoisted(() => ({
  mockNavigateTo: vi.fn(),
  routeState: {
    params: { orgId: "org-123", groupId: "group-456" } as Record<
      string,
      unknown
    >,
    query: {} as Record<string, unknown>,
    path: "/en/organizations/org-123/groups/group-456",
    name: "organizations-orgId-groups-groupId",
  },
}));

mockNuxtImport("navigateTo", () => mockNavigateTo);
mockNuxtImport("useRoute", () => () => routeState);

const stubs = {
  Head: { template: "<div><slot /></div>" },
  Title: { template: "<div><slot /></div>" },
};

describe("organization group index page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routeState.params = { orgId: "org-123", groupId: "group-456" };
    routeState.path = "/en/organizations/org-123/groups/group-456";
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      configurable: true,
      writable: true,
    });
  });

  it("redirects to the group about page using the route params", async () => {
    await render(OrganizationGroupIndexPage, { global: { stubs } });

    expect(mockNavigateTo).toHaveBeenCalledWith(
      "/en/organizations/org-123/groups/group-456/about"
    );
    expect(mockNavigateTo.mock.calls[0]?.[0]).not.toContain("undefined");
  });

  it("does not redirect when already on the group about page", async () => {
    routeState.path = "/en/organizations/org-123/groups/group-456/about";

    await render(OrganizationGroupIndexPage, { global: { stubs } });

    expect(mockNavigateTo).not.toHaveBeenCalled();
  });

  it("redirects at the mobile/large breakpoint boundary (640px)", async () => {
    Object.defineProperty(window, "innerWidth", {
      value: 640,
      configurable: true,
      writable: true,
    });

    await render(OrganizationGroupIndexPage, { global: { stubs } });

    expect(mockNavigateTo).toHaveBeenCalledWith(
      "/en/organizations/org-123/groups/group-456/about"
    );
  });

  it("does not redirect at a small mobile viewport width", async () => {
    Object.defineProperty(window, "innerWidth", {
      value: 500,
      configurable: true,
      writable: true,
    });

    await render(OrganizationGroupIndexPage, { global: { stubs } });

    expect(mockNavigateTo).not.toHaveBeenCalled();
  });

  it("does not call Nuxt composables from the raw window resize listener", async () => {
    // `useI18n()` must be resolved during setup. Vue-i18n's `useI18n()` throws
    // "Must be called at the top of a `setup` function" when it runs outside of
    // an active component instance, which is the case inside a raw DOM listener.
    const useI18nSpy = vi.spyOn(globalThis, "useI18n");

    await render(OrganizationGroupIndexPage, { global: { stubs } });

    const callsAfterMount = useI18nSpy.mock.calls.length;

    Object.defineProperty(window, "innerWidth", {
      value: 640,
      configurable: true,
      writable: true,
    });
    window.dispatchEvent(new Event("resize"));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(useI18nSpy.mock.calls.length).toBe(callsAfterMount);

    useI18nSpy.mockRestore();
  });
});
