// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGroupFAQEntryMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useGroupFAQEntryMutations } from "../../../app/composables/mutations/useGroupFAQEntryMutations";
import { getKeyForGetGroup } from "../../../app/composables/queries/useGetGroup";
import { sampleFaqData, sampleFaqEntry, setupMutationMocks } from "./setup";

const {
  mockRefreshNuxtData,
  showToastError,
  createGroupFaq,
  updateGroupFaq,
  reorderGroupFaqs,
  deleteGroupFaq,
} = vi.hoisted(() => ({
  mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
  showToastError: vi.fn(),
  createGroupFaq: vi.fn(),
  updateGroupFaq: vi.fn(),
  reorderGroupFaqs: vi.fn(),
  deleteGroupFaq: vi.fn(),
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

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useGroupFAQEntryMutations", () => {
  const groupId = ref("group-123");

  beforeEach(() => {
    groupId.value = "group-123";
    setupMutationMocks([
      mockRefreshNuxtData,
      createGroupFaq,
      updateGroupFaq,
      reorderGroupFaqs,
      deleteGroupFaq,
    ]);
  });

  describe("createFAQ", () => {
    it("calls createGroupFaq with groupId and faqData on success", async () => {
      const { createFAQ } = useGroupFAQEntryMutations(groupId);

      const result = await createFAQ(sampleFaqData);

      expect(createGroupFaq).toHaveBeenCalledWith(
        "group-123",
        expect.objectContaining(sampleFaqData)
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData with getKeyForGetGroup(id) on success", async () => {
      const { createFAQ } = useGroupFAQEntryMutations(groupId);

      await createFAQ(sampleFaqData);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroup("group-123")
      );
    });

    it("sets loading true then false", async () => {
      const { createFAQ, loading } = useGroupFAQEntryMutations(groupId);

      const promise = createFAQ(sampleFaqData);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when groupId is empty", async () => {
      groupId.value = "";
      const { createFAQ } = useGroupFAQEntryMutations(groupId);

      const result = await createFAQ(sampleFaqData);

      expect(result).toBe(false);
      expect(createGroupFaq).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      createGroupFaq.mockRejectedValue(new Error("Create failed"));
      const { createFAQ, error } = useGroupFAQEntryMutations(groupId);

      const result = await createFAQ(sampleFaqData);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });

    it("returns false when service rejects invalid FAQ data", async () => {
      const badFaqData = { question: "", answer: "" };
      createGroupFaq.mockRejectedValue(new Error("Invalid FAQ data"));
      const { createFAQ, error } = useGroupFAQEntryMutations(groupId);

      const result = await createFAQ(badFaqData);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("updateFAQ", () => {
    it("calls updateGroupFaq with faq on success", async () => {
      const { updateFAQ } = useGroupFAQEntryMutations(groupId);

      const result = await updateFAQ(sampleFaqEntry);

      expect(updateGroupFaq).toHaveBeenCalledWith(sampleFaqEntry);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { updateFAQ } = useGroupFAQEntryMutations(groupId);

      await updateFAQ(sampleFaqEntry);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroup("group-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      updateGroupFaq.mockRejectedValue(new Error("Update failed"));
      const { updateFAQ, error } = useGroupFAQEntryMutations(groupId);

      const result = await updateFAQ(sampleFaqEntry);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("reorderFAQs", () => {
    it("calls reorderGroupFaqs with faqs on success", async () => {
      const faqs = [sampleFaqEntry];
      const { reorderFAQs } = useGroupFAQEntryMutations(groupId);

      const result = await reorderFAQs(faqs);

      expect(reorderGroupFaqs).toHaveBeenCalledWith(faqs);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { reorderFAQs } = useGroupFAQEntryMutations(groupId);

      await reorderFAQs([sampleFaqEntry]);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroup("group-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      reorderGroupFaqs.mockRejectedValue(new Error("Reorder failed"));
      const { reorderFAQs, error } = useGroupFAQEntryMutations(groupId);

      const result = await reorderFAQs([sampleFaqEntry]);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("deleteFAQ", () => {
    it("calls deleteGroupFaq with faqId on success", async () => {
      const { deleteFAQ } = useGroupFAQEntryMutations(groupId);

      const result = await deleteFAQ(sampleFaqEntry.id);

      expect(deleteGroupFaq).toHaveBeenCalledWith(sampleFaqEntry.id);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { deleteFAQ } = useGroupFAQEntryMutations(groupId);

      await deleteFAQ(sampleFaqEntry.id);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroup("group-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      deleteGroupFaq.mockRejectedValue(new Error("Delete failed"));
      const { deleteFAQ, error } = useGroupFAQEntryMutations(groupId);

      const result = await deleteFAQ(sampleFaqEntry.id);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshGroupData", () => {
    it("calls refreshNuxtData with getKeyForGetGroup(id)", async () => {
      const { refreshGroupData } = useGroupFAQEntryMutations(groupId);

      await refreshGroupData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroup("group-123")
      );
    });

    it("no-ops when groupId is empty", async () => {
      groupId.value = "";
      const { refreshGroupData } = useGroupFAQEntryMutations(groupId);

      await refreshGroupData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
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
