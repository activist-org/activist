// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGroupImageMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useGroupImageMutations } from "../../../app/composables/mutations/useGroupImageMutations";
import { getKeyForGetGroupImages } from "../../../app/composables/queries/useGetGroupImages";
import { createSampleUploadableFile, setupMutationMocks } from "./setup";

const defaultContentImage = {
  id: "img-1",
  fileObject: "/test/image.png",
  creation_date: "2024-01-01T00:00:00Z",
  sequence_index: 0,
};

const {
  mockRefreshNuxtData,
  showToastError,
  updateGroupImage,
  uploadGroupImages,
} = vi.hoisted(() => ({
  mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
  showToastError: vi.fn(),
  updateGroupImage: vi.fn(),
  uploadGroupImages: vi.fn(),
}));

vi.mock("../../../app/services/communities/group/image", () => ({
  updateGroupImage: (...args: unknown[]) => updateGroupImage(...args),
  uploadGroupImages: (...args: unknown[]) => uploadGroupImages(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useGroupImageMutations", () => {
  const groupId = ref("group-123");

  beforeEach(() => {
    groupId.value = "group-123";
    setupMutationMocks([
      mockRefreshNuxtData,
      updateGroupImage,
      uploadGroupImages,
    ]);
  });

  describe("updateImage", () => {
    it("calls updateGroupImage with groupId and contentImage on success", async () => {
      const { updateImage } = useGroupImageMutations(groupId);

      const result = await updateImage(defaultContentImage as never);

      expect(updateGroupImage).toHaveBeenCalledWith(
        "group-123",
        defaultContentImage
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData with getKeyForGetGroupImages(id) on success", async () => {
      const { updateImage } = useGroupImageMutations(groupId);

      await updateImage(defaultContentImage as never);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroupImages("group-123")
      );
    });

    it("sets loading true then false", async () => {
      const { updateImage, loading } = useGroupImageMutations(groupId);

      const promise = updateImage(defaultContentImage as never);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when groupId is empty", async () => {
      groupId.value = "";
      const { updateImage } = useGroupImageMutations(groupId);

      const result = await updateImage(defaultContentImage as never);

      expect(result).toBe(false);
      expect(updateGroupImage).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      updateGroupImage.mockRejectedValue(new Error("Update failed"));
      const { updateImage, error } = useGroupImageMutations(groupId);

      const result = await updateImage(defaultContentImage as never);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("uploadImages", () => {
    it("calls uploadGroupImages with groupId and images on success", async () => {
      const images = [createSampleUploadableFile()];
      const { uploadImages } = useGroupImageMutations(groupId);

      const result = await uploadImages(images);

      expect(uploadGroupImages).toHaveBeenCalledWith(
        "group-123",
        images,
        undefined
      );
      expect(result).toBe(true);
    });

    it("calls uploadGroupImages with sequences when provided", async () => {
      const images = [createSampleUploadableFile()];
      const sequences = [1];
      const { uploadImages } = useGroupImageMutations(groupId);

      await uploadImages(images, sequences);

      expect(uploadGroupImages).toHaveBeenCalledWith(
        "group-123",
        images,
        sequences
      );
    });

    it("calls refreshNuxtData on success", async () => {
      const { uploadImages } = useGroupImageMutations(groupId);

      await uploadImages([createSampleUploadableFile()]);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroupImages("group-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      uploadGroupImages.mockRejectedValue(new Error("Upload failed"));
      const { uploadImages, error } = useGroupImageMutations(groupId);

      const result = await uploadImages([createSampleUploadableFile()]);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshGroupData", () => {
    it("calls refreshNuxtData with getKeyForGetGroupImages(id)", async () => {
      const { refreshGroupData } = useGroupImageMutations(groupId);

      await refreshGroupData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroupImages("group-123")
      );
    });

    it("no-ops when groupId is empty", async () => {
      groupId.value = "";
      const { refreshGroupData } = useGroupImageMutations(groupId);

      await refreshGroupData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useGroupImageMutations(groupId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
