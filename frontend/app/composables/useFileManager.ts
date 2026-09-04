// SPDX-License-Identifier: AGPL-3.0-or-later

export function useFileManager() {
  const { handleError } = useAppError();
  const { locale, t } = useI18n();

  const defaultImageUrls = computed(() => {
    const colorMode = useColorMode();
    const imageColor = colorMode.value === "light" ? "light" : "dark";
    return [
      `${GET_ACTIVE_IMAGE_URL}_${imageColor}.png`,
      `${GET_ORGANIZED_IMAGE_URL}_${imageColor}.png`,
      `${GROW_ORGANIZATION_IMAGE_URL}_${imageColor}.png`,
    ];
  });

  function formatMaxImageSize() {
    const maxImageSizeInMB = MAX_IMAGE_SIZE_IN_BYTES / (1024 * 1024);
    return `${new Intl.NumberFormat(locale.value, {
      maximumFractionDigits: 1,
    }).format(maxImageSizeInMB)} MB`;
  }

  function formatFileNames(fileNames: string[]) {
    return new Intl.ListFormat(locale.value, {
      style: "long",
      type: "conjunction",
    }).format(fileNames);
  }

  function getMessageForTooLargeFiles(files: File[]) {
    const fileNames = files.map((file) => file.name);
    const messageKey =
      files.length === 1
        ? "i18n.composables.use_file_manager.file_too_large"
        : "i18n.composables.use_file_manager.files_too_large";
    return {
      fileNames,
      messageKey,
    };
  }

  function isImageWithinSizeLimit(file: File) {
    return file.size <= MAX_IMAGE_SIZE_IN_BYTES;
  }

  function partitionImageFilesBySize(files: File[]) {
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    for (const file of files) {
      if (isImageWithinSizeLimit(file)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    }

    return {
      validFiles,
      invalidFiles,
    };
  }

  function getValidatedUploadableFile(file?: File) {
    try {
      if (!file) {
        throw new AppError(
          t("i18n.composables.use_file_manager.no_file_provided"),
          AppErrorCause.VALIDATION
        );
      }

      const { validFiles } = partitionImageFilesBySize([file]);
      if (validFiles && !validFiles?.length) {
        const { fileNames, messageKey } = getMessageForTooLargeFiles([file]);
        throw new AppError(
          t(messageKey, {
            file_name: fileNames[0],
            max_size: formatMaxImageSize(),
          }),
          AppErrorCause.VALIDATION
        );
      }
      return new UploadableFile(validFiles[0] as File);
    } catch (error) {
      if (error instanceof AppError) {
        handleError(error);
      }
      return null;
    }
  }

  function getIconImage(files: File[]) {
    return getValidatedUploadableFile(files[0]);
  }

  function handleAddFiles(newFiles: File[], files: FileUploadMix[]) {
    const allowedTypes = ["image/jpeg", "image/png"];
    const validImageFiles = [...newFiles].filter((file) =>
      allowedTypes.includes(file.type)
    );
    const { validFiles, invalidFiles } =
      partitionImageFilesBySize(validImageFiles);
    try {
      if (invalidFiles.length > 0) {
        const { fileNames, messageKey } =
          getMessageForTooLargeFiles(invalidFiles);
        throw new AppError(
          t(messageKey, {
            file_name: fileNames[0],
            file_names: formatFileNames(fileNames),
            max_size: formatMaxImageSize(),
          }),
          AppErrorCause.VALIDATION
        );
      }
      const newUploadableFiles = validFiles
        .map((file, index) => ({
          type: "upload",
          data: new UploadableFile(file),
          sequence: index + files.length,
        }))
        .filter((file) => !fileExists(file.data.id, files)) as FileUploadMix[];

      return [...files, ...newUploadableFiles];
    } catch (error) {
      if (error instanceof AppError) {
        handleError(error);
        const newUploadableFiles = validFiles
          .map((file, index) => ({
            type: "upload",
            data: new UploadableFile(file),
            sequence: index + files.length,
          }))
          .filter(
            (file) => !fileExists(file.data.id, files)
          ) as FileUploadMix[];
        return [...files, ...newUploadableFiles];
      }
      return files;
    }
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
    isImageWithinSizeLimit,
    getValidatedUploadableFile,
  };
}
