// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationTextsMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationTextsMutations } from "../../../app/composables/mutations/useOrganizationTextsMutations";
import { getKeyForGetOrganization } from "../../../app/composables/queries/useGetOrganization";
import { sampleOrganizationTextFormData, setupMutationMocks } from "./setup";

const { mockRefreshNuxtData, showToastError, updateOrganizationTexts } =
  vi.hoisted(() => ({
    mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
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

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useOrganizationTextsMutations", () => {
  const organizationId = ref("org-123");
  const textId = "text-1";

  beforeEach(() => {
    organizationId.value = "org-123";
    setupMutationMocks([mockRefreshNuxtData, updateOrganizationTexts]);
  });

  describe("updateTexts", () => {
    it("calls updateOrganizationTexts with organizationId, textId and textsData on success", async () => {
      const { updateTexts } = useOrganizationTextsMutations(organizationId);

      const result = await updateTexts(sampleOrganizationTextFormData, textId);

      expect(updateOrganizationTexts).toHaveBeenCalledWith(
        "org-123",
        textId,
        sampleOrganizationTextFormData
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { updateTexts } = useOrganizationTextsMutations(organizationId);

      await updateTexts(sampleOrganizationTextFormData, textId);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("sets loading true then false", async () => {
      const { updateTexts, loading } =
        useOrganizationTextsMutations(organizationId);

      const promise = updateTexts(sampleOrganizationTextFormData, textId);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when organizationId is empty", async () => {
      organizationId.value = "";
      const { updateTexts } = useOrganizationTextsMutations(organizationId);

      const result = await updateTexts(sampleOrganizationTextFormData, textId);

      expect(result).toBe(false);
      expect(updateOrganizationTexts).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      updateOrganizationTexts.mockRejectedValue(new Error("Update failed"));
      const { updateTexts, error } =
        useOrganizationTextsMutations(organizationId);

      const result = await updateTexts(sampleOrganizationTextFormData, textId);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshOrganizationData", () => {
    it("calls refreshNuxtData with getKeyForGetOrganization(id)", async () => {
      const { refreshOrganizationData } =
        useOrganizationTextsMutations(organizationId);

      await refreshOrganizationData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("no-ops when organizationId is empty", async () => {
      organizationId.value = "";
      const { refreshOrganizationData } =
        useOrganizationTextsMutations(organizationId);

      await refreshOrganizationData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
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
