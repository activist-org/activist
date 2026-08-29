// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useLinkURL } from "../../app/composables/useLinkURL";

const isAboveMedium = ref(true);

vi.mock("~/composables/generic/useBreakpoint", () => ({
  default: () => isAboveMedium,
}));

describe("composables/useLinkURL", () => {
  // MARK: Organization Routing

  describe("organization", () => {
    const mockOrg = { id: "org-1" } as Organization;

    it("returns /organizations/:id/about on desktop (above medium breakpoint)", () => {
      isAboveMedium.value = true;
      const { linkUrl } = useLinkURL({ organization: mockOrg });
      expect(linkUrl.value).toBe("/organizations/org-1/about");
    });

    it("returns /organizations/:id on mobile (below medium breakpoint)", () => {
      isAboveMedium.value = false;
      const { linkUrl } = useLinkURL({ organization: mockOrg });
      expect(linkUrl.value).toBe("/organizations/org-1");
    });
  });

  // MARK: Group Routing

  describe("group", () => {
    const mockGroup = {
      id: "grp-1",
      org: { id: "org-1" },
    } as unknown as Group;

    it("returns /organizations/:orgId/groups/:groupId/about on desktop", () => {
      isAboveMedium.value = true;
      const { linkUrl } = useLinkURL({ group: mockGroup });
      expect(linkUrl.value).toBe("/organizations/org-1/groups/grp-1/about");
    });

    it("returns /organizations/:orgId/groups/:groupId on mobile", () => {
      isAboveMedium.value = false;
      const { linkUrl } = useLinkURL({ group: mockGroup });
      expect(linkUrl.value).toBe("/organizations/org-1/groups/grp-1");
    });
  });

  // MARK: Event Routing

  describe("event", () => {
    const mockEvent = { id: "evt-1" } as CommunityEvent;

    it("returns /events/:id/about on desktop", () => {
      isAboveMedium.value = true;
      const { linkUrl } = useLinkURL({ event: mockEvent });
      expect(linkUrl.value).toBe("/events/evt-1/about");
    });

    it("returns /events/:id on mobile", () => {
      isAboveMedium.value = false;
      const { linkUrl } = useLinkURL({ event: mockEvent });
      expect(linkUrl.value).toBe("/events/evt-1");
    });
  });

  // MARK: User Routing

  describe("user", () => {
    const mockUser = { id: "usr-1" } as UserActivist;

    it("returns /users/:id/about on desktop", () => {
      isAboveMedium.value = true;
      const { linkUrl } = useLinkURL({ user: mockUser });
      expect(linkUrl.value).toBe("/users/usr-1/about");
    });

    it("returns /users/:id on mobile", () => {
      isAboveMedium.value = false;
      const { linkUrl } = useLinkURL({ user: mockUser });
      expect(linkUrl.value).toBe("/users/usr-1");
    });
  });

  // MARK: Resource Routing

  describe("resource", () => {
    const mockResource = { url: "https://example.com/guide" } as Resource;

    it("returns external url without /about on desktop", () => {
      isAboveMedium.value = true;
      const { linkUrl } = useLinkURL({ resource: mockResource });
      expect(linkUrl.value).toBe("https://example.com/guide");
    });

    it("returns external url without /about on mobile", () => {
      isAboveMedium.value = false;
      const { linkUrl } = useLinkURL({ resource: mockResource });
      expect(linkUrl.value).toBe("https://example.com/guide");
    });
  });

  // MARK: Edge Cases

  describe("edge cases", () => {
    it("returns empty string when no entity is provided", () => {
      isAboveMedium.value = true;
      const { linkUrl } = useLinkURL({});
      expect(linkUrl.value).toBe("");
    });

    it("returns empty string when entity is null", () => {
      isAboveMedium.value = true;
      const { linkUrl } = useLinkURL({ organization: null });
      expect(linkUrl.value).toBe("");
    });

    it("dynamically updates linkUrl when breakpoint ref changes", () => {
      const mockOrg = { id: "org-1" } as Organization;
      isAboveMedium.value = false;
      const { linkUrl } = useLinkURL({ organization: mockOrg });
      expect(linkUrl.value).toBe("/organizations/org-1");

      isAboveMedium.value = true;
      expect(linkUrl.value).toBe("/organizations/org-1/about");
    });
  });
});
