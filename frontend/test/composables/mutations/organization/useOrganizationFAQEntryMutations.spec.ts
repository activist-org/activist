// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationFAQEntryMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationFAQEntryMutations } from "../../../../app/composables/mutations";
import { sampleFaqData, sampleFaqEntry, setupMutationMocks } from "../setup";

// MARK: Hoisted Mocks

const {
  createOrganizationFaq,
  updateOrganizationFaq,
  reorderOrganizationFaqs,
  deleteOrganizationFaq,
  invalidateOrganizationCache,
} = vi.hoisted(() => ({
  createOrganizationFaq: vi.fn(),
  updateOrganizationFaq: vi.fn(),
  reorderOrganizationFaqs: vi.fn(),
  deleteOrganizationFaq: vi.fn(),
  invalidateOrganizationCache: vi.fn(),
}));

// MARK: Module Mocks

vi.mock("../../../../app/services/communities/organization/faq", () => ({
  createOrganizationFaq: (...args: unknown[]) => createOrganizationFaq(...args),
  updateOrganizationFaq: (...args: unknown[]) => updateOrganizationFaq(...args),
  reorderOrganizationFaqs: (...args: unknown[]) =>
    reorderOrganizationFaqs(...args),
  deleteOrganizationFaq: (...args: unknown[]) => deleteOrganizationFaq(...args),
}));

vi.mock("../../../../app/composables/cache/useOrganizationCache", () => ({
  useOrganizationCache: () => ({
    invalidateOrganizationCache,
    getKeyForOrganization: (id: string) => ["organization", id],
  }),
}));

// MARK: Tests

describe("useOrganizationFAQEntryMutations", () => {
  const orgId = ref("org-123");

  beforeEach(() => {
    orgId.value = "org-123";
    setupMutationMocks([
      createOrganizationFaq,
      updateOrganizationFaq,
      reorderOrganizationFaqs,
      deleteOrganizationFaq,
      invalidateOrganizationCache,
    ]);
  });

  describe("createFAQ", () => {
    it("calls createOrganizationFaq with orgId and faqData on success", async () => {
      const { createFAQ } = useOrganizationFAQEntryMutations(orgId);

      await createFAQ(sampleFaqData);

      expect(createOrganizationFaq).toHaveBeenCalledWith(
        "org-123",
        expect.objectContaining(sampleFaqData)
      );
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { createFAQ } = useOrganizationFAQEntryMutations(orgId);

      await createFAQ(sampleFaqData);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects when service throws", async () => {
      createOrganizationFaq.mockRejectedValue(new Error("Create failed"));
      const { createFAQ } = useOrganizationFAQEntryMutations(orgId);

      await expect(createFAQ(sampleFaqData)).rejects.toThrow("Create failed");
    });

    it("rejects when service rejects invalid FAQ data", async () => {
      createOrganizationFaq.mockRejectedValue(new Error("Invalid FAQ data"));
      const { createFAQ } = useOrganizationFAQEntryMutations(orgId);

      await expect(createFAQ({ question: "", answer: "" })).rejects.toThrow(
        "Invalid FAQ data"
      );
    });
  });

  describe("updateFAQ", () => {
    it("calls updateOrganizationFaq with faq on success", async () => {
      const { updateFAQ } = useOrganizationFAQEntryMutations(orgId);

      await updateFAQ(sampleFaqEntry);

      expect(updateOrganizationFaq).toHaveBeenCalledWith(sampleFaqEntry);
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { updateFAQ } = useOrganizationFAQEntryMutations(orgId);

      await updateFAQ(sampleFaqEntry);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects when service throws", async () => {
      updateOrganizationFaq.mockRejectedValue(new Error("Update failed"));
      const { updateFAQ } = useOrganizationFAQEntryMutations(orgId);

      await expect(updateFAQ(sampleFaqEntry)).rejects.toThrow("Update failed");
    });
  });

  describe("reorderFAQs", () => {
    it("calls reorderOrganizationFaqs with faqs on success", async () => {
      const faqs = [sampleFaqEntry];
      const { reorderFAQs } = useOrganizationFAQEntryMutations(orgId);

      await reorderFAQs(faqs);

      expect(reorderOrganizationFaqs).toHaveBeenCalledWith(faqs);
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { reorderFAQs } = useOrganizationFAQEntryMutations(orgId);

      await reorderFAQs([sampleFaqEntry]);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects when service throws", async () => {
      reorderOrganizationFaqs.mockRejectedValue(new Error("Reorder failed"));
      const { reorderFAQs } = useOrganizationFAQEntryMutations(orgId);

      await expect(reorderFAQs([sampleFaqEntry])).rejects.toThrow(
        "Reorder failed"
      );
    });

    it("optimistically writes the new order to the query cache before the request settles", async () => {
      const queryCache = globalThis.useQueryCacheMock();
      const previousOrg = { id: "org-123", faqEntries: [sampleFaqEntry] };
      queryCache.getQueryData.mockReturnValueOnce(previousOrg);
      const reordered = [{ ...sampleFaqEntry, id: "second" }];
      const { reorderFAQs } = useOrganizationFAQEntryMutations(orgId);

      await reorderFAQs(reordered);

      expect(queryCache.setQueryData).toHaveBeenCalledWith(
        ["organization", "org-123"],
        {
          ...previousOrg,
          faqEntries: reordered,
        }
      );
    });

    it("rolls back the query cache to the previous order when the request fails", async () => {
      reorderOrganizationFaqs.mockRejectedValue(new Error("Reorder failed"));
      const queryCache = globalThis.useQueryCacheMock();
      const previousOrg = { id: "org-123", faqEntries: [sampleFaqEntry] };
      queryCache.getQueryData.mockReturnValueOnce(previousOrg);
      const { reorderFAQs } = useOrganizationFAQEntryMutations(orgId);

      await reorderFAQs([{ ...sampleFaqEntry, id: "second" }]).catch(() => {});

      expect(queryCache.setQueryData).toHaveBeenLastCalledWith(
        ["organization", "org-123"],
        previousOrg
      );
    });
  });

  describe("deleteFAQ", () => {
    it("calls deleteOrganizationFaq with faqId on success", async () => {
      const { deleteFAQ } = useOrganizationFAQEntryMutations(orgId);

      await deleteFAQ(sampleFaqEntry.id);

      expect(deleteOrganizationFaq).toHaveBeenCalledWith(sampleFaqEntry.id);
    });

    it("calls invalidateOrganizationCache via onSuccess on success", async () => {
      const { deleteFAQ } = useOrganizationFAQEntryMutations(orgId);

      await deleteFAQ(sampleFaqEntry.id);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      deleteOrganizationFaq.mockRejectedValue(new Error("Delete failed"));
      const { deleteFAQ } = useOrganizationFAQEntryMutations(orgId);

      await expect(deleteFAQ(sampleFaqEntry.id)).rejects.toThrow(
        "Delete failed"
      );

      expect(invalidateOrganizationCache).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns loading and error", () => {
      const { loading, error } = useOrganizationFAQEntryMutations(orgId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
