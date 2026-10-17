// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import { useLinkURL } from "../../app/composables/useLinkURL";

describe("composables/useLinkURL", () => {
  // MARK: Organization Routing

  describe("organization", () => {
    const mockOrg = { id: "org-1" } as Organization;

    it("returns /organizations/:id/about", () => {
      const { linkUrl } = useLinkURL({ organization: mockOrg });
      expect(linkUrl.value).toBe("/organizations/org-1/about");
    });
  });

  // MARK: Group Routing

  describe("group", () => {
    const mockGroup = {
      id: "grp-1",
      org: { id: "org-1" },
    } as unknown as Group;

    it("returns /organizations/:orgId/groups/:groupId/about", () => {
      const { linkUrl } = useLinkURL({ group: mockGroup });
      expect(linkUrl.value).toBe("/organizations/org-1/groups/grp-1/about");
    });
  });

  // MARK: Event Routing

  describe("event", () => {
    const mockEvent = { id: "evt-1" } as CommunityEvent;

    it("returns /events/:id/about", () => {
      const { linkUrl } = useLinkURL({ event: mockEvent });
      expect(linkUrl.value).toBe("/events/evt-1/about");
    });
  });

  // MARK: User Routing

  describe("user", () => {
    const mockUser = { id: "usr-1" } as UserActivist;

    it("returns /users/:id/about", () => {
      const { linkUrl } = useLinkURL({ user: mockUser });
      expect(linkUrl.value).toBe("/users/usr-1/about");
    });
  });

  // MARK: Resource Routing

  describe("resource", () => {
    const mockResource = { url: "https://example.com/guide" } as Resource;

    it("returns external url without /about", () => {
      const { linkUrl } = useLinkURL({ resource: mockResource });
      expect(linkUrl.value).toBe("https://example.com/guide");
    });
  });

  // MARK: Edge Cases

  describe("edge cases", () => {
    it("returns /about when empty props are provided", () => {
      const { linkUrl } = useLinkURL({});
      expect(linkUrl.value).toBe("/about");
    });

    it("returns /about when entity is null", () => {
      const { linkUrl } = useLinkURL({ organization: null });
      expect(linkUrl.value).toBe("/about");
    });
  });
});
