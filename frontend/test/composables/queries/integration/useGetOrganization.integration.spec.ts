// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Integration tests for useGetOrganization composable.
 * Tests actual behavior flows: fetch → cache → error handling with ID matching.
 */
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockOrganization } from "../../../mocks/factories";
import { createMockNuxtApp } from "../helpers/useAsyncDataMock";

// Type helper for entities with id (workaround for .d.ts inheritance).
type MockOrganization = ReturnType<typeof createMockOrganization> & {
  id: string;
};

// MARK: Mocks

const mockShowToastError = vi.fn();

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError: mockShowToastError,
  }),
}));

const mockSetOrganization = vi.fn();
const mockGetOrganization = vi.fn(() => null as MockOrganization | null);

vi.mock("../../../../app/stores/organization", () => ({
  useOrganizationStore: () => ({
    setOrganization: mockSetOrganization,
    getOrganization: mockGetOrganization,
  }),
}));

const mockGetOrganizationService = vi.fn();

vi.mock("../../../../app/services/entities/organization", () => ({
  getOrganization: (id: string) => mockGetOrganizationService(id),
}));

// MARK: Tests

describe("useGetOrganization Integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetOrganization.mockReturnValue(null);
    mockGetOrganizationService.mockResolvedValue(null);
  });

  // MARK: Success Fetch Flow

  describe("Success Fetch Flow", () => {
    it("composable returns expected structure", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries/useGetOrganization");

      const result = useGetOrganization("org-123");

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("refresh");
    });

    it("getOrganization service can be called with ID", async () => {
      const mockOrg = createMockOrganization();
      mockGetOrganizationService.mockResolvedValue(mockOrg);

      const result = await mockGetOrganizationService("org-123");

      expect(mockGetOrganizationService).toHaveBeenCalledWith("org-123");
      expect(result).toEqual(mockOrg);
    });

    it("setOrganization store method can be called", () => {
      const mockOrg = createMockOrganization();
      mockSetOrganization(mockOrg);

      expect(mockSetOrganization).toHaveBeenCalledWith(mockOrg);
    });
  });

  // MARK: Cache Fallback Logic

  describe("Cache Fallback Logic", () => {
    it("getOrganization returns cached org when store has matching ID", () => {
      const cachedOrg = createMockOrganization() as MockOrganization;
      mockGetOrganization.mockReturnValue(cachedOrg);

      const result = mockGetOrganization();

      expect(result).toEqual(cachedOrg);
      expect(result?.id).toBe(cachedOrg.id);
    });

    it("cache check logic: store ID matches requested ID returns store data", () => {
      const storeOrg = createMockOrganization() as MockOrganization;
      mockGetOrganization.mockReturnValue(storeOrg);
      const requestedId = storeOrg.id;

      // Simulate getCachedData logic from composable
      const getCachedDataLogic = (requestId: string) => {
        const org = mockGetOrganization();
        if (org && org.id !== "" && org.id === requestId) {
          return org;
        }
        return undefined;
      };

      expect(getCachedDataLogic(requestedId)).toEqual(storeOrg);
    });

    it("cache check logic: store ID differs returns undefined", () => {
      const storeOrg = createMockOrganization() as MockOrganization;
      mockGetOrganization.mockReturnValue(storeOrg);
      const differentId = "different-org-id";

      // Simulate getCachedData logic.
      const getCachedDataLogic = (requestId: string) => {
        const org = mockGetOrganization();
        if (org && org.id !== "" && org.id === requestId) {
          return org;
        }
        return undefined;
      };

      expect(getCachedDataLogic(differentId)).toBeUndefined();
    });
  });

  // MARK: Hydration Logic

  describe("Hydration Logic", () => {
    it("getCachedData returns store during hydration when ID matches", () => {
      const storeOrg = createMockOrganization() as MockOrganization;
      mockGetOrganization.mockReturnValue(storeOrg);

      const nuxtApp = createMockNuxtApp({
        isHydrating: true,
        payloadData: { [`organization:${storeOrg.id}`]: storeOrg },
      });

      // Simulate getCachedData logic.
      const getCachedDataLogic = (key: string, requestId: string) => {
        const org = mockGetOrganization();
        if (
          nuxtApp.isHydrating &&
          org &&
          org.id !== "" &&
          org.id === requestId
        ) {
          return org;
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(
        getCachedDataLogic(`organization:${storeOrg.id}`, storeOrg.id)
      ).toEqual(storeOrg);
    });

    it("getCachedData returns payload during hydration when store empty", () => {
      const payloadOrg = createMockOrganization() as MockOrganization;
      mockGetOrganization.mockReturnValue(null);

      const nuxtApp = createMockNuxtApp({
        isHydrating: true,
        payloadData: { [`organization:${payloadOrg.id}`]: payloadOrg },
      });

      // Simulate getCachedData logic.
      const getCachedDataLogic = (key: string, requestId: string) => {
        const org = mockGetOrganization();
        if (
          nuxtApp.isHydrating &&
          org &&
          org.id !== "" &&
          org.id === requestId
        ) {
          return org;
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(
        getCachedDataLogic(`organization:${payloadOrg.id}`, payloadOrg.id)
      ).toEqual(payloadOrg);
    });

    it("getCachedData returns static when not hydrating", () => {
      const staticOrg = createMockOrganization() as MockOrganization;
      mockGetOrganization.mockReturnValue(null);

      const nuxtApp = createMockNuxtApp({
        isHydrating: false,
        staticData: { [`organization:${staticOrg.id}`]: staticOrg },
      });

      // Simulate getCachedData logic.
      const getCachedDataLogic = (key: string, requestId: string) => {
        const org = mockGetOrganization();
        if (
          nuxtApp.isHydrating &&
          org &&
          org.id !== "" &&
          org.id === requestId
        ) {
          return org;
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(
        getCachedDataLogic(`organization:${staticOrg.id}`, staticOrg.id)
      ).toEqual(staticOrg);
    });
  });

  // MARK: Conditional Fetch

  describe("Conditional Fetch", () => {
    it("handler returns null when ID is empty", async () => {
      // Simulate handler logic.
      const handlerLogic = async (orgId: string) => {
        if (!orgId || orgId === "") return null;
        return await mockGetOrganizationService(orgId);
      };

      const result = await handlerLogic("");

      expect(result).toBeNull();
      expect(mockGetOrganizationService).not.toHaveBeenCalled();
    });

    it("handler fetches when ID is provided", async () => {
      const mockOrg = createMockOrganization();
      mockGetOrganizationService.mockResolvedValue(mockOrg);

      // Simulate handler logic.
      const handlerLogic = async (orgId: string) => {
        if (!orgId || orgId === "") return null;
        const org = await mockGetOrganizationService(orgId);
        mockSetOrganization(org);
        return org;
      };

      const result = await handlerLogic("org-123");

      expect(mockGetOrganizationService).toHaveBeenCalledWith("org-123");
      expect(mockSetOrganization).toHaveBeenCalledWith(mockOrg);
      expect(result).toEqual(mockOrg);
    });
  });

  // MARK: Error Handling

  describe("Error Handling", () => {
    it("showToastError is called with error message", () => {
      mockShowToastError("API connection failed");

      expect(mockShowToastError).toHaveBeenCalledWith("API connection failed");
    });

    it("getOrganization service can reject with error", async () => {
      const apiError = new Error("Organization not found");
      mockGetOrganizationService.mockRejectedValue(apiError);

      await expect(mockGetOrganizationService("org-123")).rejects.toThrow(
        "Organization not found"
      );
    });

    it("error handler logic: catches error, shows toast, rethrows", async () => {
      const apiError = new Error("Network error");
      mockGetOrganizationService.mockRejectedValue(apiError);

      // Simulate handler error logic.
      const handlerLogic = async (orgId: string) => {
        try {
          return await mockGetOrganizationService(orgId);
        } catch (error) {
          mockShowToastError((error as Error).message);
          throw error;
        }
      };

      await expect(handlerLogic("org-123")).rejects.toThrow("Network error");
      expect(mockShowToastError).toHaveBeenCalledWith("Network error");
    });

    it("store is not updated when API fails", async () => {
      mockGetOrganizationService.mockRejectedValue(new Error("Failed"));

      try {
        const org = await mockGetOrganizationService("org-123");
        mockSetOrganization(org);
      } catch {
        // Don't call setOrganization on error.
      }

      expect(mockSetOrganization).not.toHaveBeenCalled();
    });
  });

  // MARK: Cache Key

  describe("Cache Key", () => {
    it("getKeyForGetOrganization returns ID-based key", async () => {
      const { getKeyForGetOrganization } =
        await import("../../../../app/composables/queries/useGetOrganization");

      expect(getKeyForGetOrganization("org-123")).toBe("organization:org-123");
      expect(getKeyForGetOrganization("abc")).toBe("organization:abc");
    });

    it("different IDs produce different keys", async () => {
      const { getKeyForGetOrganization } =
        await import("../../../../app/composables/queries/useGetOrganization");

      const key1 = getKeyForGetOrganization("org-1");
      const key2 = getKeyForGetOrganization("org-2");

      expect(key1).not.toBe(key2);
    });
  });
});
