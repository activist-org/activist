// SPDX-License-Identifier: AGPL-3.0-or-later
import { MAX_IMAGE_SIZE_IN_BYTES } from "#shared/utils/uploadLimits";

export function useFileManager() {
  const { showToastError } = useToaster();
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

  function showTooLargeFilesError(files: File[]) {
    if (files.length === 0) {
      return;
    }

    const maxSize = formatMaxImageSize();
    const fileNames = files.map((file) => file.name);
    const messageKey =
      files.length === 1
        ? "i18n.components.use_file_manager.file_too_large"
        : "i18n.components.use_file_manager.files_too_large";

    showToastError(
      t(messageKey, {
        file_name: fileNames[0],
        file_names: formatFileNames(fileNames),
        max_size: maxSize,
      })
    );
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
    if (!file) {
      return null;
    }

    const { validFiles, invalidFiles } = partitionImageFilesBySize([file]);
    showTooLargeFilesError(invalidFiles);

    if (!validFiles[0]) {
      return null;
    }

    return new UploadableFile(validFiles[0]);
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

    showTooLargeFilesError(invalidFiles);

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
    isImageWithinSizeLimit,
    getValidatedUploadableFile,
  };
}
