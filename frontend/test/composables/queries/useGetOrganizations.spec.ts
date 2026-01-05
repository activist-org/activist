// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetOrganizations composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import type { Organization } from "../../../shared/types/organization";

import { getKeyForGetOrganizations } from "../../../app/composables/queries/useGetOrganizations";
import {
  createMockOrganization,
  createMockOrganizationFilters,
} from "../../mocks/factories";

// MARK: Mocks

const mockShowToastError = vi.fn();

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError: mockShowToastError,
  }),
}));

const mockSetOrganizations = vi.fn();
const mockGetOrganizations = vi.fn((): Organization[] => []);
const mockSetPage = vi.fn();
const mockGetPage = vi.fn(() => 1);
const mockSetFilters = vi.fn();
const mockGetFilters = vi.fn(() => ({}));

vi.mock("../../../app/stores/organization", () => ({
  useOrganizationStore: () => ({
    setOrganizations: mockSetOrganizations,
    getOrganizations: mockGetOrganizations,
    setPage: mockSetPage,
    getPage: mockGetPage,
    setFilters: mockSetFilters,
    getFilters: mockGetFilters,
  }),
}));

const mockListOrganizations = vi.fn();

vi.mock("../../../app/services/entities/organization", () => ({
  listOrganizations: (params: unknown) => mockListOrganizations(params),
}));

// MARK: Tests

describe("useGetOrganizations", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetOrganizations.mockReturnValue([]);
    mockListOrganizations.mockResolvedValue({ data: [], isLastPage: false });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("getKeyForGetOrganizations", () => {
    it("returns consistent cache key", () => {
      const key1 = getKeyForGetOrganizations();
      const key2 = getKeyForGetOrganizations();

      expect(key1).toBe(key2);
    });

    it("returns 'organizations-list' as the cache key", () => {
      expect(getKeyForGetOrganizations()).toBe("organizations-list");
    });

    it("returns a non-empty string", () => {
      const key = getKeyForGetOrganizations();

      expect(typeof key).toBe("string");
      expect(key.length).toBeGreaterThan(0);
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");

      const result = useGetOrganizations(ref({}));

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");

      const result = useGetOrganizations(ref({}));

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");

      const result = useGetOrganizations(ref({}));

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");

      const result = useGetOrganizations(ref({}));

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });

    it("returns an object with getMore function", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");

      const result = useGetOrganizations(ref({}));

      expect(result).toHaveProperty("getMore");
      expect(typeof result.getMore).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data is a Vue ref with value property", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");

      const { data } = useGetOrganizations(ref({}));

      expect(data).toHaveProperty("value");
    });

    it("data defaults to empty array", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");

      const { data } = useGetOrganizations(ref({}));

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("pending is a Vue ref with boolean value", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");

      const { pending } = useGetOrganizations(ref({}));

      expect(pending).toHaveProperty("value");
      expect(typeof pending.value).toBe("boolean");
    });

    it("error is a Vue ref", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");

      const { error } = useGetOrganizations(ref({}));

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");

      const { error } = useGetOrganizations(ref({}));

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: Filters Parameter

  describe("Filters Parameter", () => {
    it("accepts ref of filters", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");
      const filters = ref(createMockOrganizationFilters());

      const result = useGetOrganizations(filters);

      expect(result).toBeDefined();
    });

    it("accepts empty filters object", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");

      const result = useGetOrganizations(ref({}));

      expect(result).toBeDefined();
    });
  });

  // MARK: Type Safety

  describe("Type Safety", () => {
    it("data.value is typed as Organization array", async () => {
      const { useGetOrganizations } =
        await import("../../../app/composables/queries/useGetOrganizations");

      const { data } = useGetOrganizations(ref({}));

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("createMockOrganization produces valid Organization structure", () => {
      const org = createMockOrganization({ id: "test-org" });

      expect(org).toHaveProperty("id", "test-org");
      expect(org).toHaveProperty("createdBy");
      expect(org).toHaveProperty("location");
    });

    it("createMockOrganizationFilters produces valid filters", () => {
      const filters = createMockOrganizationFilters();

      expect(filters).toBeDefined();
      expect(typeof filters).toBe("object");
    });
  });
});
