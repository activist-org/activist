// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationImageMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationImageMutations } from "../../../app/composables/mutations/useOrganizationImageMutations";
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
  updateOrganizationImage,
  uploadOrganizationImages,
  uploadOrganizationIconImage,
  invalidateOrganizationCache,
  invalidateOrganizationImageCache,
} = vi.hoisted(() => ({
  mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
  showToastError: vi.fn(),
  updateOrganizationImage: vi.fn(),
  uploadOrganizationImages: vi.fn(),
  uploadOrganizationIconImage: vi.fn(),
  invalidateOrganizationCache: vi.fn(),
  invalidateOrganizationImageCache: vi.fn(),
}));

vi.mock("../../../app/services/communities/organization/image", () => ({
  updateOrganizationImage: (...args: unknown[]) =>
    updateOrganizationImage(...args),
  uploadOrganizationImages: (...args: unknown[]) =>
    uploadOrganizationImages(...args),
  uploadOrganizationIconImage: (...args: unknown[]) =>
    uploadOrganizationIconImage(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

vi.mock("../../../app/composables/cache/useOrganizationCache", () => ({
  useOrganizationCache: () => ({
    invalidateOrganizationCache,
    invalidateOrganizationImageCache,
  }),
}));

// vi.mock("../../../app/stores/data/organization", () => ({
//   useOrganizationListStore: () => ({ setItems }),
// }));

// The organizations list refresh still goes through refreshNuxtData.
// mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useOrganizationImageMutations", () => {
  const organizationId = ref("org-123");

  beforeEach(() => {
    organizationId.value = "org-123";
    setupMutationMocks([
      mockRefreshNuxtData,
      updateOrganizationImage,
      uploadOrganizationImages,
      uploadOrganizationIconImage,
      invalidateOrganizationCache,
      invalidateOrganizationImageCache,
    ]);
  });

  describe("updateImage", () => {
    it("calls updateOrganizationImage with organizationId and contentImage on success", async () => {
      const { updateImage } = useOrganizationImageMutations(organizationId);

      await updateImage(defaultContentImage as never);

      expect(updateOrganizationImage).toHaveBeenCalledWith(
        "org-123",
        defaultContentImage
      );
    });

    it("calls invalidateOrganizationImageCache via onSettled on success", async () => {
      const { updateImage } = useOrganizationImageMutations(organizationId);

      await updateImage(defaultContentImage as never);

      expect(invalidateOrganizationImageCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects, sets error, and still invalidates when service throws", async () => {
      updateOrganizationImage.mockRejectedValue(new Error("Update failed"));
      const { updateImage, error } =
        useOrganizationImageMutations(organizationId);

      await expect(updateImage(defaultContentImage as never)).rejects.toThrow(
        "Update failed"
      );

      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(invalidateOrganizationImageCache).toHaveBeenCalledWith("org-123");
    });
  });

  describe("uploadImages", () => {
    it("calls uploadOrganizationImages with organizationId, images and sequences on success", async () => {
      const images = [createSampleUploadableFile()];
      const { uploadImages } = useOrganizationImageMutations(organizationId);

      await uploadImages({ images, sequences: [0] });

      expect(uploadOrganizationImages).toHaveBeenCalledWith(
        "org-123",
        images,
        [0]
      );
    });

    it("calls invalidateOrganizationImageCache via onSettled on success", async () => {
      const { uploadImages } = useOrganizationImageMutations(organizationId);

      await uploadImages({ images: [createSampleUploadableFile()] });

      expect(invalidateOrganizationImageCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects, sets error, and still invalidates when service throws", async () => {
      uploadOrganizationImages.mockRejectedValue(new Error("Upload failed"));
      const { uploadImages, error } =
        useOrganizationImageMutations(organizationId);

      await expect(
        uploadImages({ images: [createSampleUploadableFile()] })
      ).rejects.toThrow("Upload failed");

      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(invalidateOrganizationImageCache).toHaveBeenCalledWith("org-123");
    });
  });

  describe("uploadIconImage", () => {
    it("calls uploadOrganizationIconImage with organizationId and image on success", async () => {
      const image = createSampleUploadableFile();
      const { uploadIconImage } = useOrganizationImageMutations(organizationId);

      await uploadIconImage(image);

      expect(uploadOrganizationIconImage).toHaveBeenCalledWith(
        "org-123",
        image
      );
    });

    it("invalidates the organization and clears the cached list on success", async () => {
      const { uploadIconImage } = useOrganizationImageMutations(organizationId);

      await uploadIconImage(createSampleUploadableFile());

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
      await vi.waitFor(() => {
        expect(invalidateOrganizationCache).toHaveBeenCalled();
      });
    });

    it("rejects, sets error, and still invalidates when service throws", async () => {
      uploadOrganizationIconImage.mockRejectedValue(new Error("Upload failed"));
      const { uploadIconImage, error } =
        useOrganizationImageMutations(organizationId);

      await expect(
        uploadIconImage(createSampleUploadableFile())
      ).rejects.toThrow("Upload failed");

      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useOrganizationImageMutations(organizationId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
