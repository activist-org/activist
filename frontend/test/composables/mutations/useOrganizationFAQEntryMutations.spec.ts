// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationFAQEntryMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationFAQEntryMutations } from "../../../app/composables/mutations/useOrganizationFAQEntryMutations";
import { getKeyForGetOrganization } from "../../../app/composables/queries/useGetOrganization";
import { sampleFaqData, sampleFaqEntry, setupMutationMocks } from "./setup";

const {
  mockRefreshNuxtData,
  showToastError,
  createOrganizationFaq,
  updateOrganizationFaq,
  reorderOrganizationFaqs,
  deleteOrganizationFaq,
} = vi.hoisted(() => ({
  mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
  showToastError: vi.fn(),
  createOrganizationFaq: vi.fn(),
  updateOrganizationFaq: vi.fn(),
  reorderOrganizationFaqs: vi.fn(),
  deleteOrganizationFaq: vi.fn(),
}));

vi.mock("../../../app/services/communities/organization/faq", () => ({
  createOrganizationFaq: (...args: unknown[]) => createOrganizationFaq(...args),
  updateOrganizationFaq: (...args: unknown[]) => updateOrganizationFaq(...args),
  reorderOrganizationFaqs: (...args: unknown[]) =>
    reorderOrganizationFaqs(...args),
  deleteOrganizationFaq: (...args: unknown[]) => deleteOrganizationFaq(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useOrganizationFAQEntryMutations", () => {
  const organizationId = ref("org-123");

  beforeEach(() => {
    organizationId.value = "org-123";
    setupMutationMocks([
      mockRefreshNuxtData,
      createOrganizationFaq,
      updateOrganizationFaq,
      reorderOrganizationFaqs,
      deleteOrganizationFaq,
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

    it("calls refreshNuxtData with getKeyForGetOrganization(id) on success", async () => {
      const { createFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await createFAQ(sampleFaqData);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("sets loading true then false", async () => {
      const { createFAQ, loading } =
        useOrganizationFAQEntryMutations(organizationId);

      const promise = createFAQ(sampleFaqData);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when organizationId is empty", async () => {
      organizationId.value = "";
      const { createFAQ } = useOrganizationFAQEntryMutations(organizationId);

      const result = await createFAQ(sampleFaqData);

      expect(result).toBe(false);
      expect(createOrganizationFaq).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      createOrganizationFaq.mockRejectedValue(new Error("Create failed"));
      const { createFAQ, error } =
        useOrganizationFAQEntryMutations(organizationId);

      const result = await createFAQ(sampleFaqData);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });

    it("returns false when service rejects invalid FAQ data", async () => {
      const badFaqData = { question: "", answer: "" };
      createOrganizationFaq.mockRejectedValue(new Error("Invalid FAQ data"));
      const { createFAQ, error } =
        useOrganizationFAQEntryMutations(organizationId);

      const result = await createFAQ(badFaqData);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("updateFAQ", () => {
    it("calls updateOrganizationFaq with faq on success", async () => {
      const { updateFAQ } = useOrganizationFAQEntryMutations(organizationId);

      const result = await updateFAQ(sampleFaqEntry);

      expect(updateOrganizationFaq).toHaveBeenCalledWith(sampleFaqEntry);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { updateFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await updateFAQ(sampleFaqEntry);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      updateOrganizationFaq.mockRejectedValue(new Error("Update failed"));
      const { updateFAQ, error } =
        useOrganizationFAQEntryMutations(organizationId);

      const result = await updateFAQ(sampleFaqEntry);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
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

    it("calls refreshNuxtData on success", async () => {
      const { reorderFAQs } = useOrganizationFAQEntryMutations(organizationId);

      await reorderFAQs([sampleFaqEntry]);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      reorderOrganizationFaqs.mockRejectedValue(new Error("Reorder failed"));
      const { reorderFAQs, error } =
        useOrganizationFAQEntryMutations(organizationId);

      const result = await reorderFAQs([sampleFaqEntry]);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("deleteFAQ", () => {
    it("calls deleteOrganizationFaq with faqId on success", async () => {
      const { deleteFAQ } = useOrganizationFAQEntryMutations(organizationId);

      const result = await deleteFAQ(sampleFaqEntry.id);

      expect(deleteOrganizationFaq).toHaveBeenCalledWith(sampleFaqEntry.id);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { deleteFAQ } = useOrganizationFAQEntryMutations(organizationId);

      await deleteFAQ(sampleFaqEntry.id);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      deleteOrganizationFaq.mockRejectedValue(new Error("Delete failed"));
      const { deleteFAQ, error } =
        useOrganizationFAQEntryMutations(organizationId);

      const result = await deleteFAQ(sampleFaqEntry.id);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshOrganizationData", () => {
    it("calls refreshNuxtData with getKeyForGetOrganization(id)", async () => {
      const { refreshOrganizationData } =
        useOrganizationFAQEntryMutations(organizationId);

      await refreshOrganizationData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("no-ops when organizationId is empty", async () => {
      organizationId.value = "";
      const { refreshOrganizationData } =
        useOrganizationFAQEntryMutations(organizationId);

      await refreshOrganizationData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } =
        useOrganizationFAQEntryMutations(organizationId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
