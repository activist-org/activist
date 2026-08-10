// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationFAQEntryMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationFAQEntryMutations } from "../../../app/composables/mutations/useOrganizationFAQEntryMutations";
import { sampleFaqData, sampleFaqEntry, setupMutationMocks } from "./setup";

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

vi.mock("../../../app/services/communities/organization/faq", () => ({
  createOrganizationFaq: (...args: unknown[]) => createOrganizationFaq(...args),
  updateOrganizationFaq: (...args: unknown[]) => updateOrganizationFaq(...args),
  reorderOrganizationFaqs: (...args: unknown[]) =>
    reorderOrganizationFaqs(...args),
  deleteOrganizationFaq: (...args: unknown[]) => deleteOrganizationFaq(...args),
}));

vi.mock("../../../app/composables/cache/useOrganizationCache", () => ({
  useOrganizationCache: () => ({ invalidateOrganizationCache }),
}));

// MARK: Tests

describe("useOrganizationFAQEntryMutations", () => {
  const organizationId = ref("org-123");

  beforeEach(() => {
    organizationId.value = "org-123";
    setupMutationMocks([
      createOrganizationFaq,
      updateOrganizationFaq,
      reorderOrganizationFaqs,
      deleteOrganizationFaq,
      invalidateOrganizationCache,
    ]);
  });

  describe("createFAQ", () => {
    it("calls createOrganizationFaq with organizationId and faqData on success", async () => {
      const { createFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await createFAQ(sampleFaqData);

      expect(createOrganizationFaq).toHaveBeenCalledWith(
        "org-123",
        expect.objectContaining(sampleFaqData)
      );
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { createFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await createFAQ(sampleFaqData);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects when service throws", async () => {
      createOrganizationFaq.mockRejectedValue(new Error("Create failed"));
      const { createFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await expect(createFAQ(sampleFaqData)).rejects.toThrow("Create failed");
    });

    it("rejects when service rejects invalid FAQ data", async () => {
      createOrganizationFaq.mockRejectedValue(new Error("Invalid FAQ data"));
      const { createFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await expect(createFAQ({ question: "", answer: "" })).rejects.toThrow(
        "Invalid FAQ data"
      );
    });
  });

  describe("updateFAQ", () => {
    it("calls updateOrganizationFaq with faq on success", async () => {
      const { updateFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await updateFAQ(sampleFaqEntry);

      expect(updateOrganizationFaq).toHaveBeenCalledWith(sampleFaqEntry);
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { updateFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await updateFAQ(sampleFaqEntry);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects when service throws", async () => {
      updateOrganizationFaq.mockRejectedValue(new Error("Update failed"));
      const { updateFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await expect(updateFAQ(sampleFaqEntry)).rejects.toThrow("Update failed");
    });
  });

  describe("reorderFAQs", () => {
    it("calls reorderOrganizationFaqs with faqs on success", async () => {
      const faqs = [sampleFaqEntry];
      const { reorderFAQs } = useOrganizationFAQEntryMutations(organizationId);

      await reorderFAQs(faqs);

      expect(reorderOrganizationFaqs).toHaveBeenCalledWith(faqs);
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { reorderFAQs } = useOrganizationFAQEntryMutations(organizationId);

      await reorderFAQs([sampleFaqEntry]);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects when service throws", async () => {
      reorderOrganizationFaqs.mockRejectedValue(new Error("Reorder failed"));
      const { reorderFAQs } = useOrganizationFAQEntryMutations(organizationId);

      await expect(reorderFAQs([sampleFaqEntry])).rejects.toThrow(
        "Reorder failed"
      );
    });
  });

  describe("deleteFAQ", () => {
    it("calls deleteOrganizationFaq with faqId on success", async () => {
      const { deleteFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await deleteFAQ(sampleFaqEntry.id);

      expect(deleteOrganizationFaq).toHaveBeenCalledWith(sampleFaqEntry.id);
    });

    it("calls invalidateOrganizationCache via onSuccess on success", async () => {
      const { deleteFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await deleteFAQ(sampleFaqEntry.id);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      deleteOrganizationFaq.mockRejectedValue(new Error("Delete failed"));
      const { deleteFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await expect(deleteFAQ(sampleFaqEntry.id)).rejects.toThrow(
        "Delete failed"
      );

      expect(invalidateOrganizationCache).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns loading and error", () => {
      const { loading, error } =
        useOrganizationFAQEntryMutations(organizationId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
