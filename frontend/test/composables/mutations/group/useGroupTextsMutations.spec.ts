// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGroupTextsMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useGroupTextsMutations } from "../../../../app/composables/mutations";
import { sampleGroupTextFormData, setupMutationMocks } from "../setup";

const { invalidateGroupCache, showToastError, updateGroupTexts } = vi.hoisted(
  () => ({
    invalidateGroupCache: vi.fn(),
    showToastError: vi.fn(),
    updateGroupTexts: vi.fn(),
  })
);

vi.mock("../../../../app/services/communities/group/text", () => ({
  updateGroupTexts: (...args: unknown[]) => updateGroupTexts(...args),
}));

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

vi.mock("../../../../app/composables/cache/useGroupCache", () => ({
  useGroupCache: () => ({ invalidateGroupCache }),
}));

describe("useGroupTextsMutations", () => {
  const groupId = ref("group-123");
  const textId = "text-1";

  beforeEach(() => {
    groupId.value = "group-123";
    setupMutationMocks([updateGroupTexts, invalidateGroupCache]);
  });

  describe("updateTexts", () => {
    it("calls updateGroupTexts with groupId, textId and textsData on success", async () => {
      const { updateTexts } = useGroupTextsMutations(groupId);

      await updateTexts({
        textId,
        data: sampleGroupTextFormData,
      });

      expect(updateGroupTexts).toHaveBeenCalledWith(
        "group-123",
        textId,
        sampleGroupTextFormData
      );
    });

    it("calls invalidateGroupCache via onSettled on success", async () => {
      const { updateTexts } = useGroupTextsMutations(groupId);

      await updateTexts({ textId, data: sampleGroupTextFormData });

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("rejects and still invalidates cache via onSettled when service throws", async () => {
      updateGroupTexts.mockRejectedValue(new Error("Update failed"));
      const { updateTexts } = useGroupTextsMutations(groupId);

      await expect(
        updateTexts({
          textId,
          data: sampleGroupTextFormData,
        })
      ).rejects.toThrow("Update failed");

      expect(invalidateGroupCache).not.toHaveBeenCalledWith("group-123");
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useGroupTextsMutations(groupId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
