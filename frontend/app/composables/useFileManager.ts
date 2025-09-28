// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ContentImage, FileUploadMix } from "~/types/content/file";

import { UploadableFile } from "~/types/content/file";

const { token } = useAuth();

const defaultImageUrls = computed(() => {
  const colorMode = useColorMode();
  const imageColor = colorMode.value === "light" ? "light" : "dark";
  return [
    `${GET_ACTIVE_IMAGE_URL}_${imageColor}.png`,
    `${GET_ORGANIZED_IMAGE_URL}_${imageColor}.png`,
    `${GROW_ORGANIZATION_IMAGE_URL}_${imageColor}.png`,
  ];
});

export function useFileManager() {
  const uploadError = ref(false);

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

  function getIconImage(files: File[]) {
    return new UploadableFile(files[0]);
  }

  function handleAddFiles(newFiles: File[], files: FileUploadMix[]) {
    const allowedTypes = ["image/jpeg", "image/png"];
    const validFiles = [...newFiles].filter((file) =>
      allowedTypes.includes(file.type)
    );
    const newUploadableFiles = validFiles
      .map((file, index) => ({
        type: "upload",
        data: new UploadableFile(file),
        sequence: index + files.length,
      }))
      .filter((file) => !fileExists(file.data.id, files)) as FileUploadMix[];

    return [...files, ...newUploadableFiles];
  }

  function fileExists(otherId: string, files: FileUploadMix[]) {
    return files.some((file: FileUploadMix) => file.data.id === otherId);
  }

  async function removeFile(
    files: FileUploadMix[],
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
        (f) => f.type === "file" && f.data.id === file.id
      );
      await deleteImage(file.id);
      if (index > -1) {
        files.splice(index, 1);
      }
    }
  }

  return {
    uploadError,
    defaultImageUrls,
    deleteImage,
    handleAddFiles,
    removeFile,
    getIconImage,
  };
}
