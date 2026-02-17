// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationImageMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationImageMutations } from "../../../app/composables/mutations/useOrganizationImageMutations";
import { getKeyForGetOrganization } from "../../../app/composables/queries/useGetOrganization";
import { getKeyForGetOrganizationImages } from "../../../app/composables/queries/useGetOrganizationImages";
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
} = vi.hoisted(() => ({
  mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
  showToastError: vi.fn(),
  updateOrganizationImage: vi.fn(),
  uploadOrganizationImages: vi.fn(),
  uploadOrganizationIconImage: vi.fn(),
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

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useOrganizationImageMutations", () => {
  const organizationId = ref("org-123");

  beforeEach(() => {
    organizationId.value = "org-123";
    setupMutationMocks([
      mockRefreshNuxtData,
      updateOrganizationImage,
      uploadOrganizationImages,
      uploadOrganizationIconImage,
    ]);
  });

  describe("updateImage", () => {
    it("calls updateOrganizationImage with organizationId and contentImage on success", async () => {
      const { updateImage } = useOrganizationImageMutations(organizationId);

      const result = await updateImage(defaultContentImage as never);

      expect(updateOrganizationImage).toHaveBeenCalledWith(
        "org-123",
        defaultContentImage
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData with getKeyForGetOrganizationImages(id) on success", async () => {
      const { updateImage } = useOrganizationImageMutations(organizationId);

      await updateImage(defaultContentImage as never);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganizationImages("org-123")
      );
    });

    it("sets loading true then false", async () => {
      const { updateImage, loading } =
        useOrganizationImageMutations(organizationId);

      const promise = updateImage(defaultContentImage as never);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when organizationId is empty", async () => {
      organizationId.value = "";
      const { updateImage } = useOrganizationImageMutations(organizationId);

      const result = await updateImage(defaultContentImage as never);

      expect(result).toBe(false);
      expect(updateOrganizationImage).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      updateOrganizationImage.mockRejectedValue(new Error("Update failed"));
      const { updateImage, error } =
        useOrganizationImageMutations(organizationId);

      const result = await updateImage(defaultContentImage as never);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("uploadImages", () => {
    it("calls uploadOrganizationImages with organizationId and images on success", async () => {
      const images = [createSampleUploadableFile()];
      const { uploadImages } = useOrganizationImageMutations(organizationId);

      const result = await uploadImages(images);

      expect(uploadOrganizationImages).toHaveBeenCalledWith(
        "org-123",
        images,
        undefined
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData with getKeyForGetOrganizationImages on success", async () => {
      const { uploadImages } = useOrganizationImageMutations(organizationId);

      await uploadImages([createSampleUploadableFile()]);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganizationImages("org-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      uploadOrganizationImages.mockRejectedValue(new Error("Upload failed"));
      const { uploadImages, error } =
        useOrganizationImageMutations(organizationId);

      const result = await uploadImages([createSampleUploadableFile()]);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("uploadIconImage", () => {
    it("calls uploadOrganizationIconImage with organizationId and image on success", async () => {
      const image = createSampleUploadableFile();
      const { uploadIconImage } = useOrganizationImageMutations(organizationId);

      const result = await uploadIconImage(image);

      expect(uploadOrganizationIconImage).toHaveBeenCalledWith(
        "org-123",
        image
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData with getKeyForGetOrganization on success", async () => {
      const { uploadIconImage } = useOrganizationImageMutations(organizationId);

      await uploadIconImage(createSampleUploadableFile());

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      uploadOrganizationIconImage.mockRejectedValue(new Error("Upload failed"));
      const { uploadIconImage, error } =
        useOrganizationImageMutations(organizationId);

      const result = await uploadIconImage(createSampleUploadableFile());

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshOrganizationData", () => {
    it("calls refreshNuxtData with getKeyForGetOrganization(id)", async () => {
      const { refreshOrganizationData } =
        useOrganizationImageMutations(organizationId);

      await refreshOrganizationData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("no-ops when organizationId is empty", async () => {
      organizationId.value = "";
      const { refreshOrganizationData } =
        useOrganizationImageMutations(organizationId);

      await refreshOrganizationData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshOrganizationImagesData", () => {
    it("calls refreshNuxtData with getKeyForGetOrganizationImages(id)", async () => {
      const { refreshOrganizationImagesData } =
        useOrganizationImageMutations(organizationId);

      await refreshOrganizationImagesData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganizationImages("org-123")
      );
    });

    it("no-ops when organizationId is empty", async () => {
      organizationId.value = "";
      const { refreshOrganizationImagesData } =
        useOrganizationImageMutations(organizationId);

      await refreshOrganizationImagesData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
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
