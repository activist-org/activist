// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventFAQEntryMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventFAQEntryMutations } from "../../../app/composables/mutations/useEventFAQEntryMutations";
import { sampleFaqData, sampleFaqEntry, setupMutationMocks } from "./setup";

// MARK: Hoisted Mocks

const {
  showToastError,
  createEventFaq,
  updateEventFaq,
  reorderEventFaqs,
  deleteEventFaq,
  invalidateEventCache,
} = vi.hoisted(() => ({
  showToastError: vi.fn(),
  createEventFaq: vi.fn(),
  updateEventFaq: vi.fn(),
  reorderEventFaqs: vi.fn(),
  deleteEventFaq: vi.fn(),
  invalidateEventCache: vi.fn(),
}));

// MARK: Module Mocks

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

vi.mock("../../../app/composables/cache/useEventCache", () => ({
  useEventCache: () => ({ invalidateEventCache }),
}));

// MARK: Tests

describe("useEventFAQEntryMutations", () => {
  const eventId = ref("event-123");

  beforeEach(() => {
    eventId.value = "event-123";
    setupMutationMocks([
      createEventFaq,
      updateEventFaq,
      reorderEventFaqs,
      deleteEventFaq,
      invalidateEventCache,
    ]);
    showToastError.mockReset();
  });

  describe("createFAQ", () => {
    it("calls createEventFaq with eventId and faqData on success", async () => {
      createEventFaq.mockResolvedValue(undefined);
      const { createFAQ } = useEventFAQEntryMutations(eventId);

      await createFAQ(sampleFaqData);

      expect(createEventFaq).toHaveBeenCalledTimes(1);
      expect(createEventFaq).toHaveBeenCalledWith(
        "event-123",
        expect.objectContaining(sampleFaqData)
      );
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      createEventFaq.mockResolvedValue(undefined);
      const { createFAQ } = useEventFAQEntryMutations(eventId);

      await createFAQ(sampleFaqData);

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      createEventFaq.mockRejectedValue(new Error("Service failed"));
      const { createFAQ } = useEventFAQEntryMutations(eventId);

      await createFAQ(sampleFaqData).catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });

    it("calls handleError when service rejects invalid FAQ data", async () => {
      createEventFaq.mockRejectedValue(new Error("Invalid FAQ data"));
      const { createFAQ } = useEventFAQEntryMutations(eventId);

      await createFAQ({ question: "", answer: "" }).catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("updateFAQ", () => {
    it("calls updateEventFaq with eventId and faq on success", async () => {
      updateEventFaq.mockResolvedValue(undefined);
      const { updateFAQ } = useEventFAQEntryMutations(eventId);

      await updateFAQ(sampleFaqEntry);

      expect(updateEventFaq).toHaveBeenCalledWith("event-123", sampleFaqEntry);
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      updateEventFaq.mockResolvedValue(undefined);
      const { updateFAQ } = useEventFAQEntryMutations(eventId);

      await updateFAQ(sampleFaqEntry);

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      updateEventFaq.mockRejectedValue(new Error("Update failed"));
      const { updateFAQ } = useEventFAQEntryMutations(eventId);

      await updateFAQ(sampleFaqEntry).catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("reorderFAQs", () => {
    it("calls reorderEventFaqs with eventId and faqs on success", async () => {
      reorderEventFaqs.mockResolvedValue(undefined);
      const { reorderFAQs } = useEventFAQEntryMutations(eventId);

      await reorderFAQs([sampleFaqEntry]);

      expect(reorderEventFaqs).toHaveBeenCalledWith("event-123", [
        sampleFaqEntry,
      ]);
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      reorderEventFaqs.mockResolvedValue(undefined);
      const { reorderFAQs } = useEventFAQEntryMutations(eventId);

      await reorderFAQs([sampleFaqEntry]);

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      reorderEventFaqs.mockRejectedValue(new Error("Reorder failed"));
      const { reorderFAQs } = useEventFAQEntryMutations(eventId);

      await reorderFAQs([sampleFaqEntry]).catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("deleteFAQ", () => {
    it("calls deleteEventFaq with faqId on success", async () => {
      deleteEventFaq.mockResolvedValue(undefined);
      const { deleteFAQ } = useEventFAQEntryMutations(eventId);

      await deleteFAQ(sampleFaqEntry.id);

      expect(deleteEventFaq).toHaveBeenCalledWith(sampleFaqEntry.id);
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      deleteEventFaq.mockResolvedValue(undefined);
      const { deleteFAQ } = useEventFAQEntryMutations(eventId);

      await deleteFAQ(sampleFaqEntry.id);

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      deleteEventFaq.mockRejectedValue(new Error("Delete failed"));
      const { deleteFAQ } = useEventFAQEntryMutations(eventId);

      await deleteFAQ(sampleFaqEntry.id).catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns loading and error", () => {
      const { loading, error } = useEventFAQEntryMutations(eventId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
