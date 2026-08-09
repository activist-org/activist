// SPDX-License-Identifier: AGPL-3.0-or-later
export function useFileManager() {
  const defaultImageUrls = computed(() => {
    const colorMode = useColorMode();
    const imageColor = colorMode.value === "light" ? "light" : "dark";
    return [
      `${GET_ACTIVE_IMAGE_URL}_${imageColor}.png`,
      `${GET_ORGANIZED_IMAGE_URL}_${imageColor}.png`,
      `${GROW_ORGANIZATION_IMAGE_URL}_${imageColor}.png`,
    ];
  });

  function getIconImage(files: File[]) {
    if (files[0]) {
      return new UploadableFile(files[0]);
    }
    return new Error("No file provided to upload.");
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

  // Removing a stored image from the list does not delete it: callers own that,
  // so the delete goes through the entity's image mutations and invalidates.
  function removeFile(
    files: FileUploadMix[],
    file: UploadableFile | ContentImage
  ) {
    const index =
      file instanceof UploadableFile
        ? files.findIndex((f) => f.type === "upload" && f.data === file)
        : files.findIndex((f) => f.type === "file" && f.data.id === file.id);

    if (index > -1) {
      files.splice(index, 1);
    }
  }

  return {
    defaultImageUrls,
    handleAddFiles,
    removeFile,
    getIconImage,
  };
}
