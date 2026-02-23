// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventFAQEntryMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 * @see https://github.com/activist-org/activist/issues/1753 (mock factories)
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventFAQEntryMutations } from "../../../app/composables/mutations/useEventFAQEntryMutations";
import { getKeyForGetEvent } from "../../../app/composables/queries/useGetEvent";
import { sampleFaqData, sampleFaqEntry, setupMutationMocks } from "./setup";

const {
  mockRefreshNuxtData,
  showToastError,
  createEventFaq,
  updateEventFaq,
  reorderEventFaqs,
  deleteEventFaq,
} = vi.hoisted(() => ({
  mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
  showToastError: vi.fn(),
  createEventFaq: vi.fn(),
  updateEventFaq: vi.fn(),
  reorderEventFaqs: vi.fn(),
  deleteEventFaq: vi.fn(),
}));

vi.mock("../../../app/services/event/faq", () => ({
  createEventFaq: (...args: unknown[]) => createEventFaq(...args),
  updateEventFaq: (...args: unknown[]) => updateEventFaq(...args),
  reorderEventFaqs: (...args: unknown[]) => reorderEventFaqs(...args),
  deleteEventFaq: (...args: unknown[]) => deleteEventFaq(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useEventFAQEntryMutations", () => {
  const eventId = ref("event-123");

  beforeEach(() => {
    eventId.value = "event-123";
    setupMutationMocks([
      mockRefreshNuxtData,
      createEventFaq,
      updateEventFaq,
      reorderEventFaqs,
      deleteEventFaq,
    ]);
  });

  describe("createFAQ", () => {
    it("calls createEventFaq with eventId and faqData on success", async () => {
      const { createFAQ } = useEventFAQEntryMutations(eventId);

      const result = await createFAQ(sampleFaqData);

      expect(createEventFaq).toHaveBeenCalledTimes(1);
      expect(createEventFaq).toHaveBeenCalledWith(
        "event-123",
        expect.objectContaining(sampleFaqData)
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData with getKeyForGetEvent(id) on success", async () => {
      const { createFAQ } = useEventFAQEntryMutations(eventId);

      await createFAQ(sampleFaqData);

      expect(mockRefreshNuxtData).toHaveBeenCalledTimes(1);
      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("sets loading true then false", async () => {
      const { createFAQ, loading } = useEventFAQEntryMutations(eventId);

      const promise = createFAQ(sampleFaqData);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false, sets error, and calls showToastError when service throws", async () => {
      const err = new Error("Service failed");
      createEventFaq.mockRejectedValue(err);
      const { createFAQ, error } = useEventFAQEntryMutations(eventId);

      const result = await createFAQ(sampleFaqData);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });

    it("returns false when eventId is empty", async () => {
      eventId.value = "";
      const { createFAQ } = useEventFAQEntryMutations(eventId);

      const result = await createFAQ(sampleFaqData);

      expect(result).toBe(false);
      expect(createEventFaq).not.toHaveBeenCalled();
    });

    it("returns false when service rejects invalid FAQ data", async () => {
      const badFaqData = { question: "", answer: "" };
      createEventFaq.mockRejectedValue(new Error("Invalid FAQ data"));
      const { createFAQ, error } = useEventFAQEntryMutations(eventId);

      const result = await createFAQ(badFaqData);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("updateFAQ", () => {
    it("calls updateEventFaq with eventId and faq on success", async () => {
      const { updateFAQ } = useEventFAQEntryMutations(eventId);

      const result = await updateFAQ(sampleFaqEntry);

      expect(updateEventFaq).toHaveBeenCalledWith("event-123", sampleFaqEntry);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { updateFAQ } = useEventFAQEntryMutations(eventId);

      await updateFAQ(sampleFaqEntry);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      updateEventFaq.mockRejectedValue(new Error("Update failed"));
      const { updateFAQ, error } = useEventFAQEntryMutations(eventId);

      const result = await updateFAQ(sampleFaqEntry);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("reorderFAQs", () => {
    it("calls reorderEventFaqs with eventId and faqs on success", async () => {
      const faqs = [sampleFaqEntry];
      const { reorderFAQs } = useEventFAQEntryMutations(eventId);

      const result = await reorderFAQs(faqs);

      expect(reorderEventFaqs).toHaveBeenCalledWith("event-123", faqs);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { reorderFAQs } = useEventFAQEntryMutations(eventId);

      await reorderFAQs([sampleFaqEntry]);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      reorderEventFaqs.mockRejectedValue(new Error("Reorder failed"));
      const { reorderFAQs, error } = useEventFAQEntryMutations(eventId);

      const result = await reorderFAQs([sampleFaqEntry]);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("deleteFAQ", () => {
    it("calls deleteEventFaq with faqId on success", async () => {
      const { deleteFAQ } = useEventFAQEntryMutations(eventId);

      const result = await deleteFAQ(sampleFaqEntry.id);

      expect(deleteEventFaq).toHaveBeenCalledWith(sampleFaqEntry.id);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { deleteFAQ } = useEventFAQEntryMutations(eventId);

      await deleteFAQ(sampleFaqEntry.id);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      deleteEventFaq.mockRejectedValue(new Error("Delete failed"));
      const { deleteFAQ, error } = useEventFAQEntryMutations(eventId);

      const result = await deleteFAQ(sampleFaqEntry.id);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshEventData", () => {
    it("calls refreshNuxtData with getKeyForGetEvent(id)", async () => {
      const { refreshEventData } = useEventFAQEntryMutations(eventId);

      await refreshEventData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("no-ops when eventId is empty", async () => {
      eventId.value = "";
      const { refreshEventData } = useEventFAQEntryMutations(eventId);

      await refreshEventData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useEventFAQEntryMutations(eventId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
