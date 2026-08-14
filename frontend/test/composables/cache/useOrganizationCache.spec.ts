// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationCache composable.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useOrganizationCache } from "../../../app/composables/cache/useOrganizationCache";

describe("useOrganizationCache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("invalidateOrganizationCache", () => {
    it("calls invalidateQueries with the correct key for a specific organization ID", async () => {
      const { invalidateOrganizationCache } = useOrganizationCache();

      await invalidateOrganizationCache("org-123");

      const { invalidateQueries } = globalThis.useQueryCache();

      expect(invalidateQueries).toHaveBeenCalledWith({
        key: ["organization", "org-123"],
      });
    });
  });

  describe("invalidateOrganizationList", () => {
    it("calls invalidateQueries with the root list key", async () => {
      const { invalidateOrganizationList } = useOrganizationCache();

      await invalidateOrganizationList();

      const { invalidateQueries } = globalThis.useQueryCache();

      expect(invalidateQueries).toHaveBeenCalledWith({
        key: ["organization", "list"],
      });
    });
  });

  describe("organizationCacheEntries", () => {
    it("calls getEntries with the specific organization ID key and returns the result", () => {
      const mockEntries = [{ data: { id: "org-123", name: "Test Org" } }];
      const { getEntries } = globalThis.useQueryCache();
      getEntries.mockReturnValue(mockEntries);

      const { organizationCacheEntries } = useOrganizationCache();
      const result = organizationCacheEntries("org-123");

      expect(getEntries).toHaveBeenCalledWith({
        key: ["organization", "org-123"],
      });
      expect(result).toBe(mockEntries);
    });
  });

  describe("getKeyForOrganizations", () => {
    it("generates the correct tuple array for list queries with filters", () => {
      const { getKeyForOrganizations } = useOrganizationCache();
      const filters = { search: "activism" };

      const key = getKeyForOrganizations(filters);

      expect(key).toEqual(["organization", "list", { filters }]);
    });

    it("generates the correct tuple array when filters are undefined", () => {
      const { getKeyForOrganizations } = useOrganizationCache();

      const key = getKeyForOrganizations(undefined);

      expect(key).toEqual(["organization", "list", { filters: undefined }]);
    });
  });

  describe("getKeyForOrganization", () => {
    it("generates the correct tuple array for a specific organization ID", () => {
      const { getKeyForOrganization } = useOrganizationCache();

      const key = getKeyForOrganization("org-123");

      expect(key).toEqual(["organization", "org-123"]);
    });
  });
});
