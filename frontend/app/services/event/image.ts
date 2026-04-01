// SPDX-License-Identifier: AGPL-3.0-or-later
import { post } from "~/services/http";

// MARK: Upload

/**
 * Uploads an icon image for a specific event by sending a POST request to the backend API with the image file and associated event information. The function uses the post helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param eventId The unique identifier of the event for which the icon image is being uploaded.
 * @param file The image file to be uploaded as the event icon.
 * @returns A Promise that resolves when the icon image has been successfully uploaded in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the upload process.
 */
export async function uploadEventIconImage(
  eventId: string,
  file: UploadableFile
): Promise<void> {
  try {
    const fd = new FormData();
    fd.append("entity_id", eventId);
    fd.append("entity_type", EntityType.EVENT);
    fd.append("file_object", file.file);
    await post(`/content/image_icon`, fd);
  } catch (e) {
    throw errorHandler(e);
  }
}
