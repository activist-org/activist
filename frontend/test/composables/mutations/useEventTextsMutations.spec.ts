// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventTextsMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventTextsMutations } from "../../../app/composables/mutations/useEventTextsMutations";
import { getKeyForGetEvent } from "../../../app/composables/queries/useGetEvent";
import { sampleEventTextFormData, setupMutationMocks } from "./setup";

const { mockRefreshNuxtData, showToastError, updateEventTexts } = vi.hoisted(
  () => ({
    mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
    showToastError: vi.fn(),
    updateEventTexts: vi.fn(),
  })
);

vi.mock("../../../app/services/event/text", () => ({
  updateEventTexts: (...args: unknown[]) => updateEventTexts(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useEventTextsMutations", () => {
  const eventId = ref("event-123");
  const textId = "text-1";

  beforeEach(() => {
    eventId.value = "event-123";
    setupMutationMocks([mockRefreshNuxtData, updateEventTexts]);
  });

  describe("updateTexts", () => {
    it("calls updateEventTexts with eventId, textId and textsData on success", async () => {
      const { updateTexts } = useEventTextsMutations(eventId);

      const result = await updateTexts(sampleEventTextFormData, textId);

      expect(updateEventTexts).toHaveBeenCalledWith(
        "event-123",
        textId,
        sampleEventTextFormData
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { updateTexts } = useEventTextsMutations(eventId);

      await updateTexts(sampleEventTextFormData, textId);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("sets loading true then false", async () => {
      const { updateTexts, loading } = useEventTextsMutations(eventId);

      const promise = updateTexts(sampleEventTextFormData, textId);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when eventId is empty", async () => {
      eventId.value = "";
      const { updateTexts } = useEventTextsMutations(eventId);

      const result = await updateTexts(sampleEventTextFormData, textId);

      expect(result).toBe(false);
      expect(updateEventTexts).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      updateEventTexts.mockRejectedValue(new Error("Update failed"));
      const { updateTexts, error } = useEventTextsMutations(eventId);

      const result = await updateTexts(sampleEventTextFormData, textId);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshEventData", () => {
    it("calls refreshNuxtData with getKeyForGetEvent(id)", async () => {
      const { refreshEventData } = useEventTextsMutations(eventId);

      await refreshEventData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("no-ops when eventId is empty", async () => {
      eventId.value = "";
      const { refreshEventData } = useEventTextsMutations(eventId);

      await refreshEventData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useEventTextsMutations(eventId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
