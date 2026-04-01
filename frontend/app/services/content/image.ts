// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Delete

/**
 * Deletes an image by its unique identifier from the backend API, using the del helper function for making HTTP requests and the errorHandler for consistent error handling.
 * @param imageId The unique identifier of the image to be deleted.
 * @returns A Promise that resolves when the image has been successfully deleted.
 * @throws {AppError} if the API request fails or if there is an error during the deletion process.
 */
export async function deleteImage(imageId: string) {
  if (!imageId) {
    return;
  }

  try {
    return del(`/content/images/${imageId}`, { withoutAuth: false });
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
