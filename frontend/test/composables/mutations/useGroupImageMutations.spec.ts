// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGroupImageMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useGroupImageMutations } from "../../../app/composables/mutations/useGroupImageMutations";
import { createSampleUploadableFile, setupMutationMocks } from "./setup";

const defaultContentImage = {
  id: "img-1",
  fileObject: "/test/image.png",
  creation_date: "2024-01-01T00:00:00Z",
  sequence_index: 0,
};

const {
  showToastError,
  updateGroupImage,
  uploadGroupImages,
  invalidateGroupImageCache,
} = vi.hoisted(() => ({
  showToastError: vi.fn(),
  updateGroupImage: vi.fn(),
  uploadGroupImages: vi.fn(),
  invalidateGroupImageCache: vi.fn(),
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

vi.mock("../../../app/composables/cache/useGroupCache", () => ({
  useGroupCache: () => ({ invalidateGroupImageCache }),
}));

describe("useGroupImageMutations", () => {
  const groupId = ref("group-123");

  beforeEach(() => {
    groupId.value = "group-123";
    setupMutationMocks([
      updateGroupImage,
      uploadGroupImages,
      invalidateGroupImageCache,
    ]);
  });

  describe("updateImage", () => {
    it("calls updateGroupImage with groupId and contentImage on success", async () => {
      const { updateImage } = useGroupImageMutations(groupId);

      await updateImage(defaultContentImage as never);

      expect(updateGroupImage).toHaveBeenCalledWith(
        "group-123",
        defaultContentImage
      );
    });

    it("calls invalidateGroupImageCache via onSettled on success", async () => {
      const { updateImage } = useGroupImageMutations(groupId);

      await updateImage(defaultContentImage as never);

      expect(invalidateGroupImageCache).toHaveBeenCalledWith("group-123");
    });

    it("rejects, sets error, and still invalidates when service throws", async () => {
      updateGroupImage.mockRejectedValue(new Error("Update failed"));
      const { updateImage, error } = useGroupImageMutations(groupId);

      await expect(updateImage(defaultContentImage as never)).rejects.toThrow(
        "Update failed"
      );

      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(invalidateGroupImageCache).toHaveBeenCalledWith("group-123");
    });
  });

  describe("uploadImages", () => {
    it("calls uploadGroupImages with groupId and images on success", async () => {
      const images = [createSampleUploadableFile()];
      const { uploadImages } = useGroupImageMutations(groupId);

      await uploadImages({ images });

      expect(uploadGroupImages).toHaveBeenCalledWith(
        "group-123",
        images,
        undefined
      );
    });

    it("calls uploadGroupImages with sequences when provided", async () => {
      const images = [createSampleUploadableFile()];
      const sequences = [1];
      const { uploadImages } = useGroupImageMutations(groupId);

      await uploadImages({ images, sequences });

      expect(uploadGroupImages).toHaveBeenCalledWith(
        "group-123",
        images,
        sequences
      );
    });

    it("calls invalidateGroupImageCache via onSettled on success", async () => {
      const { uploadImages } = useGroupImageMutations(groupId);

      await uploadImages({ images: [createSampleUploadableFile()] });

      expect(invalidateGroupImageCache).toHaveBeenCalledWith("group-123");
    });

    it("rejects, sets error, and still invalidates when service throws", async () => {
      uploadGroupImages.mockRejectedValue(new Error("Upload failed"));
      const { uploadImages, error } = useGroupImageMutations(groupId);

      await expect(
        uploadImages({ images: [createSampleUploadableFile()] })
      ).rejects.toThrow("Upload failed");

      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(invalidateGroupImageCache).toHaveBeenCalledWith("group-123");
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
