// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventTextsMutations composable.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventTextsMutations } from "../../../app/composables/mutations/useEventTextsMutations";
import { sampleEventTextFormData } from "./setup";

// Hoist specific spies for this test.
const { updateEventTexts, handleErrorMock, invalidateQueriesMock } = vi.hoisted(
  () => ({
    updateEventTexts: vi.fn(),
    handleErrorMock: vi.fn(),
    invalidateQueriesMock: vi.fn(),
  })
);

// Mock API service.
vi.mock("../../../app/services/event/text", () => ({
  updateEventTexts: (...args: unknown[]) => updateEventTexts(...args),
}));

// Mock error handler.
vi.mock("../../../app/composables/generic/useAppError", async () => {
  const { ref } = await import("vue");
  return {
    useAppError: () => ({
      error: ref(null),
      handleError: handleErrorMock,
    }),
  };
});

// Intercept the global @pinia/colada mock just to add a spy to useQueryCache.
vi.mock("@pinia/colada", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@pinia/colada")>();
  return {
    ...actual,
    // useMutation is handled by the global setup file.
    useQueryCache: () => ({
      invalidateQueries: invalidateQueriesMock,
      getEntries: vi.fn(),
    }),
  };
});

describe("useEventTextsMutations", () => {
  const eventId = ref("event-123");
  const textId = "text-1";

  beforeEach(() => {
    eventId.value = "event-123";
    vi.clearAllMocks();

    // Default success response.
    updateEventTexts.mockResolvedValue({ success: true });
  });

  describe("updateTexts", () => {
    it("calls updateEventTexts with correctly formatted payload on success", async () => {
      const { updateTexts } = useEventTextsMutations(eventId);

      await updateTexts({ textId, data: sampleEventTextFormData });

      expect(updateEventTexts).toHaveBeenCalledWith(
        "event-123",
        textId,
        sampleEventTextFormData
      );
    });

    it("invalidates event cache queries in onSettled", async () => {
      const { updateTexts } = useEventTextsMutations(eventId);

      await updateTexts({ textId, data: sampleEventTextFormData });
      const { invalidateQueries } = globalThis.useQueryCache();
      expect(invalidateQueries).toHaveBeenCalled();
    });

    it("sets loading true then false", async () => {
      const { updateTexts, loading } = useEventTextsMutations(eventId);

      // Trigger mutation without awaiting immediately.
      const promise = updateTexts({ textId, data: sampleEventTextFormData });

      expect(loading.value).toBe(true);

      await promise;

      expect(loading.value).toBe(false);
    });

    it("calls handleError when the service throws an error", async () => {
      const errorInstance = new Error("Update failed");
      updateEventTexts.mockRejectedValue(errorInstance);

      const { updateTexts } = useEventTextsMutations(eventId);

      // We catch it here because the global mock re-throws the error.
      await updateTexts({ textId, data: sampleEventTextFormData }).catch(
        () => {}
      );

      expect(handleErrorMock).toHaveBeenCalledWith(errorInstance);
      const { invalidateQueries } = globalThis.useQueryCache();
      // Verify cache invalidation still fires because it's in onSettled.
      expect(invalidateQueries).toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("exposes loading and error as readonly refs", () => {
      const { loading, error } = useEventTextsMutations(eventId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
