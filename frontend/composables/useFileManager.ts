// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ContentImage, FileImageMix } from "~/types/content/file";

import { UploadableFile } from "~/types/content/file";

const colorMode = useColorMode();
const { token } = useAuth();
const defaultImageUrls = computed(() => {
  const imageColor = colorMode?.preference == "light" ? "light" : "dark";
  return [
    `${GET_ACTIVE_IMAGE_URL}_${imageColor}.png`,
    `${GET_ORGANIZED_IMAGE_URL}_${imageColor}.png`,
    `${GROW_ORGANIZATION_IMAGE_URL}_${imageColor}.png`,
  ];
});

export function useFileManager() {
  const uploadError = ref(false);
  const fileImages = ref<UploadableFile[]>([]);
  const fileImageIcon = ref<UploadableFile | null>(null);

  async function deleteImage(imageId: string) {
    if (!imageId) {
      return;
    }

    try {
      return await fetch(
        `${BASE_BACKEND_URL as string}/content/images/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );
    } catch (error) {
      void error;
    }
  }

  function handleFiles(newFiles: File[], isIconImage: boolean = false) {
    const allowedTypes = ["image/jpeg", "image/png"];
    const validFiles = [...newFiles].filter((file) =>
      allowedTypes.includes(file.type)
    );
    if (isIconImage) {
      if (validFiles.length > 0) {
        fileImageIcon.value = new UploadableFile(validFiles[0]);
      } else {
        fileImageIcon.value = null;
      }
      return;
    }
    const newUploadableFiles = validFiles
      .map((file) => new UploadableFile(file))
      .filter((file) => !fileExists(file.id));

    fileImages.value = [...fileImages.value, ...newUploadableFiles];
  }

  function fileExists(otherId: string) {
    return fileImages.value.some((file: UploadableFile) => file.id === otherId);
  }

  function removeFileImageIcon() {
    fileImageIcon.value = null;
  }

  async function removeFile(
    files: FileImageMix[],
    file: UploadableFile | ContentImage
  ) {
    if (file instanceof UploadableFile) {
      const index = files.findIndex(
        (f) => f.type === "upload" && f.data === file
      );
      if (index > -1) {
        files.splice(index, 1);
      }
    } else {
      const index = files.findIndex(
        (f) => f.type === "image" && f.data.id === file.id
      );
      await deleteImage(file.id);
      if (index > -1) {
        files.splice(index, 1);
      }
    }
  }

  return {
    uploadError,
    fileImageIcon,
    fileImages,
    defaultImageUrls,
    removeFileImageIcon,
    deleteImage,
    handleFiles,
    removeFile,
  };
}
