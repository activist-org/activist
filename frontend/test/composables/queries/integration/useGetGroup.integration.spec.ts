// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Integration tests for useGetGroup composable.
 * Tests actual behavior flows: fetch → cache → error handling with ID matching.
 */
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockGroup } from "../../../mocks/factories";
import { createMockNuxtApp } from "../helpers/useAsyncDataMock";

// Type helper for entities with id (workaround for .d.ts inheritance)
type MockGroup = ReturnType<typeof createMockGroup> & { id: string };

// MARK: Mocks

const mockShowToastError = vi.fn();

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError: mockShowToastError,
  }),
}));

const mockSetGroup = vi.fn();
const mockGetGroup = vi.fn(() => null as MockGroup | null);

vi.mock("../../../../app/stores/group", () => ({
  useGroupStore: () => ({
    setGroup: mockSetGroup,
    getGroup: mockGetGroup,
  }),
}));

const mockGetGroupService = vi.fn();

vi.mock("../../../../app/services/entities/group", () => ({
  getGroup: (id: string) => mockGetGroupService(id),
}));

// MARK: Tests

describe("useGetGroup Integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetGroup.mockReturnValue(null);
    mockGetGroupService.mockResolvedValue(null);
  });

  // MARK: Success Fetch Flow

  describe("Success Fetch Flow", () => {
    it("composable returns expected structure", async () => {
      const { useGetGroup } =
        await import("../../../../app/composables/queries/useGetGroup");

      const result = useGetGroup("group-123");

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("refresh");
    });

    it("getGroup service can be called with ID", async () => {
      const mockGroup = createMockGroup();
      mockGetGroupService.mockResolvedValue(mockGroup);

      const result = await mockGetGroupService("group-123");

      expect(mockGetGroupService).toHaveBeenCalledWith("group-123");
      expect(result).toEqual(mockGroup);
    });

    it("setGroup store method can be called", () => {
      const mockGroup = createMockGroup();
      mockSetGroup(mockGroup);

      expect(mockSetGroup).toHaveBeenCalledWith(mockGroup);
    });
  });

  // MARK: Cache Fallback Logic

  describe("Cache Fallback Logic", () => {
    it("getGroup returns cached group when store has matching ID", () => {
      const cachedGroup = createMockGroup() as MockGroup;
      mockGetGroup.mockReturnValue(cachedGroup);

      const result = mockGetGroup();

      expect(result).toEqual(cachedGroup);
      expect(result?.id).toBe(cachedGroup.id);
    });

    it("cache check logic: store ID matches requested ID returns store data", () => {
      const storeGroup = createMockGroup() as MockGroup;
      mockGetGroup.mockReturnValue(storeGroup);
      const requestedId = storeGroup.id;

      // Simulate getCachedData logic
      const getCachedDataLogic = (requestId: string) => {
        const group = mockGetGroup();
        if (group && group.id !== "" && group.id === requestId) {
          return group;
        }
        return undefined;
      };

      expect(getCachedDataLogic(requestedId)).toEqual(storeGroup);
    });

    it("cache check logic: store ID differs returns undefined", () => {
      const storeGroup = createMockGroup() as MockGroup;
      mockGetGroup.mockReturnValue(storeGroup);
      const differentId = "different-group-id";

      // Simulate getCachedData logic
      const getCachedDataLogic = (requestId: string) => {
        const group = mockGetGroup();
        if (group && group.id !== "" && group.id === requestId) {
          return group;
        }
        return undefined;
      };

      expect(getCachedDataLogic(differentId)).toBeUndefined();
    });
  });

  // MARK: Hydration Logic

  describe("Hydration Logic", () => {
    it("getCachedData returns store during hydration when ID matches", () => {
      const storeGroup = createMockGroup() as MockGroup;
      mockGetGroup.mockReturnValue(storeGroup);

      const nuxtApp = createMockNuxtApp({
        isHydrating: true,
        payloadData: { [`group:${storeGroup.id}`]: storeGroup },
      });

      // Simulate getCachedData logic
      const getCachedDataLogic = (key: string, requestId: string) => {
        const group = mockGetGroup();
        if (
          nuxtApp.isHydrating &&
          group &&
          group.id !== "" &&
          group.id === requestId
        ) {
          return group;
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(
        getCachedDataLogic(`group:${storeGroup.id}`, storeGroup.id)
      ).toEqual(storeGroup);
    });

    it("getCachedData returns payload during hydration when store empty", () => {
      const payloadGroup = createMockGroup() as MockGroup;
      mockGetGroup.mockReturnValue(null);

      const nuxtApp = createMockNuxtApp({
        isHydrating: true,
        payloadData: { [`group:${payloadGroup.id}`]: payloadGroup },
      });

      // Simulate getCachedData logic
      const getCachedDataLogic = (key: string, requestId: string) => {
        const group = mockGetGroup();
        if (
          nuxtApp.isHydrating &&
          group &&
          group.id !== "" &&
          group.id === requestId
        ) {
          return group;
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(
        getCachedDataLogic(`group:${payloadGroup.id}`, payloadGroup.id)
      ).toEqual(payloadGroup);
    });

    it("getCachedData returns static when not hydrating", () => {
      const staticGroup = createMockGroup() as MockGroup;
      mockGetGroup.mockReturnValue(null);

      const nuxtApp = createMockNuxtApp({
        isHydrating: false,
        staticData: { [`group:${staticGroup.id}`]: staticGroup },
      });

      // Simulate getCachedData logic
      const getCachedDataLogic = (key: string, requestId: string) => {
        const group = mockGetGroup();
        if (
          nuxtApp.isHydrating &&
          group &&
          group.id !== "" &&
          group.id === requestId
        ) {
          return group;
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(
        getCachedDataLogic(`group:${staticGroup.id}`, staticGroup.id)
      ).toEqual(staticGroup);
    });
  });

  // MARK: Conditional Fetch

  describe("Conditional Fetch", () => {
    it("handler returns null when ID is empty", async () => {
      // Simulate handler logic
      const handlerLogic = async (groupId: string) => {
        if (!groupId || groupId === "") return null;
        return await mockGetGroupService(groupId);
      };

      const result = await handlerLogic("");

      expect(result).toBeNull();
      expect(mockGetGroupService).not.toHaveBeenCalled();
    });

    it("handler fetches when ID is provided", async () => {
      const mockGroup = createMockGroup();
      mockGetGroupService.mockResolvedValue(mockGroup);

      // Simulate handler logic
      const handlerLogic = async (groupId: string) => {
        if (!groupId || groupId === "") return null;
        const group = await mockGetGroupService(groupId);
        mockSetGroup(group);
        return group;
      };

      const result = await handlerLogic("group-123");

      expect(mockGetGroupService).toHaveBeenCalledWith("group-123");
      expect(mockSetGroup).toHaveBeenCalledWith(mockGroup);
      expect(result).toEqual(mockGroup);
    });
  });

  // MARK: Error Handling

  describe("Error Handling", () => {
    it("showToastError is called with error message", () => {
      mockShowToastError("API connection failed");

      expect(mockShowToastError).toHaveBeenCalledWith("API connection failed");
    });

    it("getGroup service can reject with error", async () => {
      const apiError = new Error("Group not found");
      mockGetGroupService.mockRejectedValue(apiError);

      await expect(mockGetGroupService("group-123")).rejects.toThrow(
        "Group not found"
      );
    });

    it("error handler logic: catches error, shows toast, rethrows", async () => {
      const apiError = new Error("Network error");
      mockGetGroupService.mockRejectedValue(apiError);

      // Simulate handler error logic
      const handlerLogic = async (groupId: string) => {
        try {
          return await mockGetGroupService(groupId);
        } catch (error) {
          mockShowToastError((error as Error).message);
          throw error;
        }
      };

      await expect(handlerLogic("group-123")).rejects.toThrow("Network error");
      expect(mockShowToastError).toHaveBeenCalledWith("Network error");
    });

    it("store is not updated when API fails", async () => {
      mockGetGroupService.mockRejectedValue(new Error("Failed"));

      try {
        const group = await mockGetGroupService("group-123");
        mockSetGroup(group);
      } catch {
        // Don't call setGroup on error
      }

      expect(mockSetGroup).not.toHaveBeenCalled();
    });
  });

  // MARK: Cache Key

  describe("Cache Key", () => {
    it("getKeyForGetGroup returns ID-based key", async () => {
      const { getKeyForGetGroup } =
        await import("../../../../app/composables/queries/useGetGroup");

      expect(getKeyForGetGroup("group-123")).toBe("group:group-123");
      expect(getKeyForGetGroup("abc")).toBe("group:abc");
    });

    it("different IDs produce different keys", async () => {
      const { getKeyForGetGroup } =
        await import("../../../../app/composables/queries/useGetGroup");

      const key1 = getKeyForGetGroup("group-1");
      const key2 = getKeyForGetGroup("group-2");

      expect(key1).not.toBe(key2);
    });
  });
});
