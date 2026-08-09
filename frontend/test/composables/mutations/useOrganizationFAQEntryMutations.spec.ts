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

      const result = await createFAQ(sampleFaqData);

      expect(createOrganizationFaq).toHaveBeenCalledWith(
        "org-123",
        expect.objectContaining(sampleFaqData)
      );
      expect(result).toBe(true);
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { createFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await createFAQ(sampleFaqData);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("returns false when organizationId is empty", async () => {
      organizationId.value = "";
      const { createFAQ } = useOrganizationFAQEntryMutations(organizationId);

      const result = await createFAQ(sampleFaqData);

      expect(result).toBe(false);
      expect(createOrganizationFaq).not.toHaveBeenCalled();
    });

    it("returns false when service throws", async () => {
      createOrganizationFaq.mockRejectedValue(new Error("Create failed"));
      const { createFAQ } = useOrganizationFAQEntryMutations(organizationId);

      const result = await createFAQ(sampleFaqData);

      expect(result).toBe(false);
    });

    it("returns false when service rejects invalid FAQ data", async () => {
      createOrganizationFaq.mockRejectedValue(new Error("Invalid FAQ data"));
      const { createFAQ } = useOrganizationFAQEntryMutations(organizationId);

      const result = await createFAQ({ question: "", answer: "" });

      expect(result).toBe(false);
    });
  });

  describe("updateFAQ", () => {
    it("calls updateOrganizationFaq with faq on success", async () => {
      const { updateFAQ } = useOrganizationFAQEntryMutations(organizationId);

      const result = await updateFAQ(sampleFaqEntry);

      expect(updateOrganizationFaq).toHaveBeenCalledWith(sampleFaqEntry);
      expect(result).toBe(true);
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { updateFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await updateFAQ(sampleFaqEntry);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("returns false when service throws", async () => {
      updateOrganizationFaq.mockRejectedValue(new Error("Update failed"));
      const { updateFAQ } = useOrganizationFAQEntryMutations(organizationId);

      const result = await updateFAQ(sampleFaqEntry);

      expect(result).toBe(false);
    });
  });

  describe("reorderFAQs", () => {
    it("calls reorderOrganizationFaqs with faqs on success", async () => {
      const faqs = [sampleFaqEntry];
      const { reorderFAQs } = useOrganizationFAQEntryMutations(organizationId);

      const result = await reorderFAQs(faqs);

      expect(reorderOrganizationFaqs).toHaveBeenCalledWith(faqs);
      expect(result).toBe(true);
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { reorderFAQs } = useOrganizationFAQEntryMutations(organizationId);

      await reorderFAQs([sampleFaqEntry]);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("returns false when service throws", async () => {
      reorderOrganizationFaqs.mockRejectedValue(new Error("Reorder failed"));
      const { reorderFAQs } = useOrganizationFAQEntryMutations(organizationId);

      const result = await reorderFAQs([sampleFaqEntry]);

      expect(result).toBe(false);
    });
  });

  describe("deleteFAQ", () => {
    it("calls deleteOrganizationFaq with faqId on success", async () => {
      const { deleteFAQ } = useOrganizationFAQEntryMutations(organizationId);

      const result = await deleteFAQ(sampleFaqEntry.id);

      expect(deleteOrganizationFaq).toHaveBeenCalledWith(sampleFaqEntry.id);
      expect(result).toBe(true);
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { deleteFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await deleteFAQ(sampleFaqEntry.id);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("returns false when service throws", async () => {
      deleteOrganizationFaq.mockRejectedValue(new Error("Delete failed"));
      const { deleteFAQ } = useOrganizationFAQEntryMutations(organizationId);

      const result = await deleteFAQ(sampleFaqEntry.id);

      expect(result).toBe(false);
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
