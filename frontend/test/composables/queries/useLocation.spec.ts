// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useLocation composable.
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getKeyForLocation,
  useLocation,
} from "../../../app/composables/queries/useLocation"; // Adjust path if needed

// MARK: Mocks

const mocks = vi.hoisted(() => ({
  handleError: vi.fn(),
  searchLocationNomatim: vi.fn(),
}));

vi.mock("../../../app/composables/generic/useAppError", () => ({
  useAppError: () => ({
    handleError: mocks.handleError,
  }),
}));

// Mock the service call
mockNuxtImport("searchLocationNomatim", () => mocks.searchLocationNomatim);
vi.mock("../../../app/services/location", () => ({
  searchLocationNomatim: mocks.searchLocationNomatim,
}));

// MARK: Tests

describe("useLocation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.searchLocationNomatim.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("getKeyForLocation", () => {
    it("generates a stringified key from query object", () => {
      const query = { city: "Berlin", country: "Germany" };
      const key = getKeyForLocation(query);

      expect(key).toBe(`user-location:{"city":"Berlin","country":"Germany"}`);
    });

    it("handles null query gracefully", () => {
      const key = getKeyForLocation(null);
      expect(key).toBe(`user-location:null`);
    });

    it("returns consistent key for same object structure", () => {
      const query1 = { q: "Paris" };
      const query2 = { q: "Paris" };

      expect(getKeyForLocation(query1)).toBe(getKeyForLocation(query2));
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", () => {
      const result = useLocation({ city: "Madrid" });
      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", () => {
      const result = useLocation({ city: "Madrid" });
      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", () => {
      const result = useLocation({ city: "Madrid" });
      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", () => {
      const result = useLocation({ city: "Madrid" });
      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data is a Vue ref with value property", () => {
      const { data } = useLocation({ q: "Rome" });
      expect(data).toHaveProperty("value");
    });

    it("pending is a Vue ref with boolean value", () => {
      const { pending } = useLocation({ q: "Rome" });
      expect(pending).toHaveProperty("value");
      expect(typeof pending.value).toBe("boolean");
    });

    it("error is a Vue ref", () => {
      const { error } = useLocation({ q: "Rome" });
      expect(error).toHaveProperty("value");
    });
  });

  // MARK: Parameter Handling

  describe("Parameter Handling", () => {
    it("accepts a static record object", () => {
      const result = useLocation({ city: "Vienna" });
      expect(result).toBeDefined();
    });

    it("accepts null without breaking", () => {
      const result = useLocation(null);
      expect(result).toBeDefined();
    });

    it("returns same structure regardless of parameter", () => {
      const result1 = useLocation({ city: "A" });
      const result2 = useLocation(null);

      expect(Object.keys(result1)).toEqual(Object.keys(result2));
    });
  });
});
