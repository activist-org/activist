// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationSupportMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationSupportMutations } from "../../../../app/composables/mutations";
import { setupMutationMocks } from "../setup";

// MARK: Hoisted Mocks

const {
  createOrganizationSupport,
  deleteOrganizationSupport,
  invalidateOrganizationCache,
  invalidateUserCache,
} = vi.hoisted(() => ({
  createOrganizationSupport: vi.fn(),
  deleteOrganizationSupport: vi.fn(),
  invalidateOrganizationCache: vi.fn(),
  invalidateUserCache: vi.fn(),
}));

// MARK: Module Mocks

vi.mock("../../../../app/services/communities/organization/support", () => ({
  createOrganizationSupport: (...args: unknown[]) =>
    createOrganizationSupport(...args),
  deleteOrganizationSupport: (...args: unknown[]) =>
    deleteOrganizationSupport(...args),
}));

vi.mock("../../../../app/composables/cache/useOrganizationCache", () => ({
  useOrganizationCache: () => ({
    invalidateOrganizationCache,
    getKeyForOrganization: (id: string) => ["organization", id],
  }),
}));

vi.mock("../../../../app/composables/cache/useUserCache", () => ({
  useUserCache: () => ({ invalidateUserCache }),
}));

// MARK: Tests

describe("useOrganizationSupportMutations", () => {
  const orgId = ref("org-123");

  beforeEach(() => {
    orgId.value = "org-123";
    setupMutationMocks([
      createOrganizationSupport,
      deleteOrganizationSupport,
      invalidateOrganizationCache,
      invalidateUserCache,
    ]);
  });

  describe("createSupport", () => {
    it("calls createOrganizationSupport with orgId and supporterType on success", async () => {
      const { createSupport } = useOrganizationSupportMutations(orgId);

      await createSupport("user");

      expect(createOrganizationSupport).toHaveBeenCalledWith("org-123", "user");
    });

    it("invalidates the organization and user cache on success", async () => {
      const { createSupport } = useOrganizationSupportMutations(orgId);

      await createSupport("user");

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
      expect(invalidateUserCache).toHaveBeenCalled();
    });

    it("does not call createOrganizationSupport when orgId is empty", async () => {
      orgId.value = "";
      const { createSupport } = useOrganizationSupportMutations(orgId);

      await createSupport("user");

      expect(createOrganizationSupport).not.toHaveBeenCalled();
    });

    it("optimistically increments the user supporter count before the request settles", async () => {
      const queryCache = globalThis.useQueryCacheMock();
      const previousOrg = {
        id: "org-123",
        supporterUserCount: 1,
        isSupportedByUser: false,
      };
      queryCache.getQueryData.mockReturnValueOnce(previousOrg);
      const { createSupport } = useOrganizationSupportMutations(orgId);

      await createSupport("user");

      expect(queryCache.setQueryData).toHaveBeenCalledWith(
        ["organization", "org-123"],
        {
          ...previousOrg,
          supporterUserCount: 2,
          isSupportedByUser: true,
        }
      );
    });

    it("optimistically increments the org supporter count before the request settles", async () => {
      const queryCache = globalThis.useQueryCacheMock();
      const previousOrg = { id: "org-123", supporterOrgCount: 1 };
      queryCache.getQueryData.mockReturnValueOnce(previousOrg);
      const { createSupport } = useOrganizationSupportMutations(orgId);

      await createSupport("org");

      expect(queryCache.setQueryData).toHaveBeenCalledWith(
        ["organization", "org-123"],
        {
          ...previousOrg,
          supporterOrgCount: 2,
        }
      );
    });

    it("rolls back the query cache and does not invalidate when the request fails", async () => {
      createOrganizationSupport.mockRejectedValue(new Error("Create failed"));
      const queryCache = globalThis.useQueryCacheMock();
      const previousOrg = {
        id: "org-123",
        supporterUserCount: 1,
        isSupportedByUser: false,
      };
      queryCache.getQueryData.mockReturnValueOnce(previousOrg);
      const { createSupport } = useOrganizationSupportMutations(orgId);

      await createSupport("user").catch(() => {});

      expect(queryCache.setQueryData).toHaveBeenLastCalledWith(
        ["organization", "org-123"],
        previousOrg
      );
      expect(invalidateOrganizationCache).not.toHaveBeenCalled();
    });
  });

  describe("deleteSupport", () => {
    it("calls deleteOrganizationSupport with orgId on success", async () => {
      const { deleteSupport } = useOrganizationSupportMutations(orgId);

      await deleteSupport("user");

      expect(deleteOrganizationSupport).toHaveBeenCalledWith("org-123");
    });

    it("invalidates the organization and user cache on success", async () => {
      const { deleteSupport } = useOrganizationSupportMutations(orgId);

      await deleteSupport("user");

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
      expect(invalidateUserCache).toHaveBeenCalled();
    });

    it("does not call deleteOrganizationSupport when orgId is empty", async () => {
      orgId.value = "";
      const { deleteSupport } = useOrganizationSupportMutations(orgId);

      await deleteSupport("user");

      expect(deleteOrganizationSupport).not.toHaveBeenCalled();
    });

    it("optimistically decrements the user supporter count before the request settles", async () => {
      const queryCache = globalThis.useQueryCacheMock();
      const previousOrg = {
        id: "org-123",
        supporterUserCount: 2,
        isSupportedByUser: true,
      };
      queryCache.getQueryData.mockReturnValueOnce(previousOrg);
      const { deleteSupport } = useOrganizationSupportMutations(orgId);

      await deleteSupport("user");

      expect(queryCache.setQueryData).toHaveBeenCalledWith(
        ["organization", "org-123"],
        {
          ...previousOrg,
          supporterUserCount: 1,
        }
      );
    });

    it("optimistically decrements the org supporter count before the request settles", async () => {
      const queryCache = globalThis.useQueryCacheMock();
      const previousOrg = { id: "org-123", supporterOrgCount: 2 };
      queryCache.getQueryData.mockReturnValueOnce(previousOrg);
      const { deleteSupport } = useOrganizationSupportMutations(orgId);

      await deleteSupport("org");

      expect(queryCache.setQueryData).toHaveBeenCalledWith(
        ["organization", "org-123"],
        {
          ...previousOrg,
          supporterOrgCount: 1,
          isSupportedByUser: false,
        }
      );
    });

    it("rolls back the query cache and does not invalidate when the request fails", async () => {
      deleteOrganizationSupport.mockRejectedValue(new Error("Delete failed"));
      const queryCache = globalThis.useQueryCacheMock();
      const previousOrg = {
        id: "org-123",
        supporterUserCount: 2,
        isSupportedByUser: true,
      };
      queryCache.getQueryData.mockReturnValueOnce(previousOrg);
      const { deleteSupport } = useOrganizationSupportMutations(orgId);

      await deleteSupport("user").catch(() => {});

      expect(queryCache.setQueryData).toHaveBeenLastCalledWith(
        ["organization", "org-123"],
        previousOrg
      );
      expect(invalidateOrganizationCache).not.toHaveBeenCalled();
    });
  });

  describe("loading state", () => {
    it("returns a loading ref", () => {
      const { loading } = useOrganizationSupportMutations(orgId);

      expect(loading).toBeDefined();
      expect(typeof loading.value).toBe("boolean");
    });
  });
});
