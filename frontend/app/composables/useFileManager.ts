// SPDX-License-Identifier: AGPL-3.0-or-later
// TODO: This file should be refactored to decouple the file management logic from the API calls, and to handle errors more robustly.
/**
 * Composable for managing file uploads and deletions in the frontend application. This composable provides functions to handle adding new files, checking for existing files, removing files, and deleting images from the server. It also includes reactive properties for tracking upload errors and computing default image URLs based on the current color mode. The composable returns these functions and properties for use in components that require file management functionality, such as forms for uploading images or managing content.
 * @returns An object containing reactive properties and functions for managing file uploads and deletions,
 * including uploadError for tracking upload errors,
 * defaultImageUrls for computing default image URLs based on color mode,
 *  deleteImage for deleting images from the server, handleAddFiles for processing new files to be added,
 * removeFile for removing files from the local state and optionally deleting them from the server,
 * and getIconImage for creating an UploadableFile instance from a given file.
 */
export function useFileManager() {
  const uploadError = ref(false);

  /**
   * Deletes an image from the server using its ID by making a DELETE request to the appropriate endpoint. If the image ID is not provided, the function simply returns without performing any action. If an error occurs during the deletion process, it is caught and logged, but not re-thrown, allowing the application to continue functioning without interruption.
   * @param imageId The ID of the image to be deleted.
   * @returns A promise that resolves when the deletion is complete, or void if no image ID was provided. If an error occurs during deletion, it is caught and logged without throwing an exception.
   */
  async function deleteImage(imageId: string) {
    if (!imageId) {
      return;
    }

    try {
      return del(`/content/images/${imageId}`, { withoutAuth: false });
    } catch (error) {
      void error;
    }
  }

  const defaultImageUrls = computed(() => {
    const colorMode = useColorMode();
    const imageColor = colorMode.value === "light" ? "light" : "dark";
    return [
      `${GET_ACTIVE_IMAGE_URL}_${imageColor}.png`,
      `${GET_ORGANIZED_IMAGE_URL}_${imageColor}.png`,
      `${GROW_ORGANIZATION_IMAGE_URL}_${imageColor}.png`,
    ];
  });

  /**
   * Creates an UploadableFile instance from the first file in the provided array of files. If no files are provided, the function returns an Error indicating that no file was provided for upload. This function is used to generate an UploadableFile object that can be used for managing file uploads in the application.
   * @param files An array of File objects from which to create an UploadableFile instance, typically obtained from a file input or drag-and-drop event.
   * @returns An UploadableFile instance created from the first file in the array, or an Error if no files were provided.
   */
  function getIconImage(files: File[]) {
    if (files[0]) {
      return new UploadableFile(files[0]);
    }
    return new Error("No file provided to upload.");
  }

  /**
   * Handles the addition of new files to the existing list of files by filtering the new files based on allowed types, creating FileUploadMix objects for valid files, and returning a new array that combines the existing files with the new uploadable files. The function ensures that only valid image files (JPEG and PNG) are processed and added to the list, and it also checks for duplicate files based on their IDs to prevent adding the same file multiple times.
   * @param newFiles An array of new File objects to be added, typically obtained from a file input or drag-and-drop event.
   * @param files The current array of FileUploadMix objects representing the existing files.
   * @returns A new array combining the existing files with the newly added valid files.
   */
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

  /**
   * Removes a file from the list of files, and if the file is an existing file (not an upload), it also deletes the image from the server. The function checks if the file to be removed is an instance of UploadableFile (indicating it's a new upload) or a ContentImage (indicating it's an existing file). For new uploads, it simply removes the file from the local state. For existing files, it calls the deleteImage function to remove the image from the server and then removes it from the local state.
   * @param otherId The ID of the file to check for existence in the list of files.
   * @param files The current array of FileUploadMix objects representing the existing files, used to check for the existence of a file with the given ID.
   * @returns A boolean indicating whether a file with the given ID exists in the list of files.
   */
  function fileExists(otherId: string, files: FileUploadMix[]) {
    return files.some((file: FileUploadMix) => file.data.id === otherId);
  }

  /**
   * Removes a file from the list of files, and if the file is an existing file (not an upload), it also deletes the image from the server. The function checks if the file to be removed is an instance of UploadableFile (indicating it's a new upload) or a ContentImage (indicating it's an existing file). For new uploads, it simply removes the file from the local state. For existing files, it calls the deleteImage function to remove the image from the server and then removes it from the local state.
   * @param files The current array of FileUploadMix objects representing the existing files.
   * @param file The file to be removed, which can be an instance of UploadableFile or ContentImage.
   */
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
