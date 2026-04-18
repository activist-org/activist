// SPDX-License-Identifier: AGPL-3.0-or-later
import { post, put } from "~/services/http";

// MARK: Upload

/**
 * Uploads one or more images for a specific group by sending a POST request to the backend API with the image files and associated metadata, including the group ID and optional sequence numbers. The function uses the post helper for making HTTP requests and the errorHandler for consistent error handling across the application. Upon receiving a successful response from the API, the function returns an array of ContentImage objects representing the uploaded images, which may include additional fields or have a different structure than the ContentImage type used in the frontend application.
 * @param groupId The unique identifier of the group for which the images are being uploaded.
 * @param files An array of image files to be uploaded for the group, including the file objects and any necessary metadata.
 * @param sequences An optional array of sequence numbers corresponding to each image file, indicating the order in which the images should be displayed for the group.
 * @returns A Promise that resolves to an array of ContentImage objects representing the uploaded images, mapped from the raw API response and containing all relevant fields for use in the frontend application.
 * @throws {AppError} if the API request fails or if there is an error during the upload process.
 */
export async function uploadGroupImages(
  groupId: string,
  files: UploadableFile[],
  sequences: number[] = []
): Promise<ContentImage[]> {
  try {
    const fd = new FormData();
    fd.append("entity_id", groupId);
    fd.append("entity_type", "group"); // backend expects EntityType.GROUP; if you have enum, adjust
    for (const s of sequences) fd.append("sequences", String(s));
    for (const f of files) fd.append("file_object", f.file);

    return await post<ContentImage[], FormData>(`/content/images`, fd);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update

/**
 * Updates an existing image for a specific group by sending a PUT request to the backend API with the provided image data, including the unique identifier of the image and any updated fields. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application. Upon receiving a successful response from the API, the function resolves without returning any value, indicating that the image has been successfully updated in the backend.
 * @param entityId The unique identifier of the group for which the image is being updated.
 * @param image The image data to be updated, including the unique identifier of the image and any updated fields such as the link URL, label, order, and associated group ID.
 * @returns A Promise that resolves when the image has been successfully updated in the backend, without returning any value.
 * @throws {AppError} if the API request fails or if there is an error during the update process.
 */
export async function updateGroupImage(
  entityId: string,
  image: ContentImage
): Promise<void> {
  try {
    await put(`/communities/group/${entityId}/images/${image.id}`, image, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Fetch

/**
 * Fetches the images associated with a specific group by sending a GET request to the backend API with the unique identifier of the group. The function uses the get helper for making HTTP requests and the errorHandler for consistent error handling across the application. Upon receiving a successful response from the API, the function returns an array of ContentImage objects representing the images associated with the specified group, which may include additional fields or have a different structure than the ContentImage type used in the frontend application.
 * @param entityId The unique identifier of the group for which the images are being fetched.
 * @returns A Promise that resolves to an array of ContentImage objects representing the images associated with the specified group, mapped from the raw API response and containing all relevant fields for use in the frontend application.
 * @throws {AppError} if the API request fails or if there is an error during the fetching process.
 */
export async function fetchGroupImages(
  entityId: string
): Promise<ContentImage[]> {
  try {
    const images = (await get(`/communities/group/${entityId}/images`, {
      withoutAuth: true,
    })) as ContentImage[];
    return images;
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
