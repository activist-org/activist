// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGroupFAQEntryMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useGroupFAQEntryMutations } from "../../../app/composables/mutations/useGroupFAQEntryMutations";
import { sampleFaqData, sampleFaqEntry, setupMutationMocks } from "./setup";

const {
  showToastError,
  createGroupFaq,
  updateGroupFaq,
  reorderGroupFaqs,
  deleteGroupFaq,
  invalidateGroupCache,
} = vi.hoisted(() => ({
  showToastError: vi.fn(),
  createGroupFaq: vi.fn(),
  updateGroupFaq: vi.fn(),
  reorderGroupFaqs: vi.fn(),
  deleteGroupFaq: vi.fn(),
  invalidateGroupCache: vi.fn(),
}));

vi.mock("../../../app/services/communities/group/faq", () => ({
  createGroupFaq: (...args: unknown[]) => createGroupFaq(...args),
  updateGroupFaq: (...args: unknown[]) => updateGroupFaq(...args),
  reorderGroupFaqs: (...args: unknown[]) => reorderGroupFaqs(...args),
  deleteGroupFaq: (...args: unknown[]) => deleteGroupFaq(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

vi.mock("../../../app/composables/cache/useGroupCache", () => ({
  useGroupCache: () => ({ invalidateGroupCache }),
}));

describe("useGroupFAQEntryMutations", () => {
  const groupId = ref("group-123");

  beforeEach(() => {
    groupId.value = "group-123";
    setupMutationMocks([
      createGroupFaq,
      updateGroupFaq,
      reorderGroupFaqs,
      deleteGroupFaq,
      invalidateGroupCache,
    ]);
  });

  describe("createFAQ", () => {
    it("calls createGroupFaq with groupId and faqData on success", async () => {
      const { createFAQ } = useGroupFAQEntryMutations(groupId);

      await createFAQ(sampleFaqData);

      expect(createGroupFaq).toHaveBeenCalledWith(
        "group-123",
        expect.objectContaining(sampleFaqData)
      );
    });

    it("calls invalidateGroupCache via onSuccess on success", async () => {
      const { createFAQ } = useGroupFAQEntryMutations(groupId);

      await createFAQ(sampleFaqData);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      createGroupFaq.mockRejectedValue(new Error("Create failed"));
      const { createFAQ } = useGroupFAQEntryMutations(groupId);

      await expect(createFAQ(sampleFaqData)).rejects.toThrow("Create failed");

      expect(invalidateGroupCache).not.toHaveBeenCalled();
    });
  });

  describe("updateFAQ", () => {
    it("calls updateGroupFaq with faq on success", async () => {
      const { updateFAQ } = useGroupFAQEntryMutations(groupId);

      await updateFAQ(sampleFaqEntry);

      expect(updateGroupFaq).toHaveBeenCalledWith(sampleFaqEntry);
    });

    it("calls invalidateGroupCache via onSuccess on success", async () => {
      const { updateFAQ } = useGroupFAQEntryMutations(groupId);

      await updateFAQ(sampleFaqEntry);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      updateGroupFaq.mockRejectedValue(new Error("Update failed"));
      const { updateFAQ } = useGroupFAQEntryMutations(groupId);

      await expect(updateFAQ(sampleFaqEntry)).rejects.toThrow("Update failed");

      expect(invalidateGroupCache).not.toHaveBeenCalled();
    });
  });

  describe("reorderFAQs", () => {
    it("calls reorderGroupFaqs with faqs on success", async () => {
      const faqs = [sampleFaqEntry];
      const { reorderFAQs } = useGroupFAQEntryMutations(groupId);

      await reorderFAQs(faqs);

      expect(reorderGroupFaqs).toHaveBeenCalledWith(faqs);
    });

    it("calls invalidateGroupCache via onSuccess on success", async () => {
      const { reorderFAQs } = useGroupFAQEntryMutations(groupId);

      await reorderFAQs([sampleFaqEntry]);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      reorderGroupFaqs.mockRejectedValue(new Error("Reorder failed"));
      const { reorderFAQs } = useGroupFAQEntryMutations(groupId);

      await expect(reorderFAQs([sampleFaqEntry])).rejects.toThrow(
        "Reorder failed"
      );

      expect(invalidateGroupCache).not.toHaveBeenCalled();
    });
  });

  describe("deleteFAQ", () => {
    it("calls deleteGroupFaq with faqId on success", async () => {
      const { deleteFAQ } = useGroupFAQEntryMutations(groupId);

      await deleteFAQ(sampleFaqEntry.id);

      expect(deleteGroupFaq).toHaveBeenCalledWith(sampleFaqEntry.id);
    });

    it("calls invalidateGroupCache via onSuccess on success", async () => {
      const { deleteFAQ } = useGroupFAQEntryMutations(groupId);

      await deleteFAQ(sampleFaqEntry.id);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      deleteGroupFaq.mockRejectedValue(new Error("Delete failed"));
      const { deleteFAQ } = useGroupFAQEntryMutations(groupId);

      await expect(deleteFAQ(sampleFaqEntry.id)).rejects.toThrow(
        "Delete failed"
      );

      expect(invalidateGroupCache).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useGroupFAQEntryMutations(groupId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
