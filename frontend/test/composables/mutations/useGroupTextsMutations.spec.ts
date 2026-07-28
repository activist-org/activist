// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGroupTextsMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useGroupTextsMutations } from "../../../app/composables/mutations/useGroupTextsMutations";
import { sampleGroupTextFormData, setupMutationMocks } from "./setup";

const { invalidateGroupCache, showToastError, updateGroupTexts } = vi.hoisted(
  () => ({
    invalidateGroupCache: vi.fn(),
    showToastError: vi.fn(),
    updateGroupTexts: vi.fn(),
  })
);

vi.mock("../../../app/services/communities/group/text", () => ({
  updateGroupTexts: (...args: unknown[]) => updateGroupTexts(...args),
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

      const result = await updateTexts(sampleGroupTextFormData, textId);

      expect(updateGroupTexts).toHaveBeenCalledWith(
        "group-123",
        textId,
        sampleGroupTextFormData
      );
      expect(result).toBe(true);
    });

    it("calls invalidateGroupCache on success", async () => {
      const { updateTexts } = useGroupTextsMutations(groupId);

      await updateTexts(sampleGroupTextFormData, textId);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("sets loading true then false", async () => {
      const { updateTexts, loading } = useGroupTextsMutations(groupId);

      const promise = updateTexts(sampleGroupTextFormData, textId);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when groupId is empty", async () => {
      groupId.value = "";
      const { updateTexts } = useGroupTextsMutations(groupId);

      const result = await updateTexts(sampleGroupTextFormData, textId);

      expect(result).toBe(false);
      expect(updateGroupTexts).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call invalidateGroupCache when service throws", async () => {
      updateGroupTexts.mockRejectedValue(new Error("Update failed"));
      const { updateTexts, error } = useGroupTextsMutations(groupId);

      const result = await updateTexts(sampleGroupTextFormData, textId);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(invalidateGroupCache).not.toHaveBeenCalled();
    });
  });

  describe("invalidateCacheRefreshGroupData", () => {
    it("calls invalidateGroupCache with groupId", async () => {
      const { invalidateCacheRefreshGroupData } =
        useGroupTextsMutations(groupId);

      await invalidateCacheRefreshGroupData();

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("no-ops when groupId is empty", async () => {
      groupId.value = "";
      const { invalidateCacheRefreshGroupData } =
        useGroupTextsMutations(groupId);

      await invalidateCacheRefreshGroupData();

      expect(invalidateGroupCache).not.toHaveBeenCalled();
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
