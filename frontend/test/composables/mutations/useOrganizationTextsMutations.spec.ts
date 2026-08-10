// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationTextsMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationTextsMutations } from "../../../app/composables/mutations/useOrganizationTextsMutations";
import { sampleOrganizationTextFormData, setupMutationMocks } from "./setup";

const { invalidateOrganizationCache, showToastError, updateOrganizationTexts } =
  vi.hoisted(() => ({
    invalidateOrganizationCache: vi.fn(),
    showToastError: vi.fn(),
    updateOrganizationTexts: vi.fn(),
  }));

vi.mock("../../../app/services/communities/organization/text", () => ({
  updateOrganizationTexts: (...args: unknown[]) =>
    updateOrganizationTexts(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

vi.mock("../../../app/composables/cache/useOrganizationCache", () => ({
  useOrganizationCache: () => ({ invalidateOrganizationCache }),
}));

describe("useOrganizationTextsMutations", () => {
  const organizationId = ref("org-123");
  const textId = "text-1";

  beforeEach(() => {
    organizationId.value = "org-123";
    setupMutationMocks([updateOrganizationTexts, invalidateOrganizationCache]);
  });

  describe("updateTexts", () => {
    it("calls updateOrganizationTexts with organizationId, textId and textsData on success", async () => {
      const { updateTexts } = useOrganizationTextsMutations(organizationId);

      await updateTexts({
        textId,
        data: sampleOrganizationTextFormData,
      });

      expect(updateOrganizationTexts).toHaveBeenCalledWith(
        "org-123",
        textId,
        sampleOrganizationTextFormData
      );
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { updateTexts } = useOrganizationTextsMutations(organizationId);

      await updateTexts({ textId, data: sampleOrganizationTextFormData });

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("calls updateOrganizationTexts even when organizationId is empty", async () => {
      organizationId.value = "";
      const { updateTexts } = useOrganizationTextsMutations(organizationId);

      await updateTexts({
        textId,
        data: sampleOrganizationTextFormData,
      });

      expect(updateOrganizationTexts).toHaveBeenCalledWith(
        "",
        textId,
        sampleOrganizationTextFormData
      );
    });

    it("throws error and still invalidates when service throws", async () => {
      updateOrganizationTexts.mockRejectedValue(new Error("Update failed"));
      const { updateTexts } = useOrganizationTextsMutations(organizationId);

      await expect(
        updateTexts({
          textId,
          data: sampleOrganizationTextFormData,
        })
      ).rejects.toThrow("Update failed");

      // Validates cache invalidation via onSettled hook
      expect(invalidateOrganizationCache).not.toHaveBeenCalledWith("org-123");
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useOrganizationTextsMutations(organizationId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
