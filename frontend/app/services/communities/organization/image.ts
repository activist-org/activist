// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Upload

/**
 * Uploads a new icon image for a specific organization by sending a POST request to the backend API with the provided image file and associated organization ID. The function uses the post helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param organizationId The unique identifier of the organization for which the icon image is being uploaded.
 * @param file The image file to be uploaded as the organization's icon, including the file object and any necessary metadata.
 * @returns A Promise that resolves when the icon image has been successfully uploaded in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the upload process.
 */
export async function uploadOrganizationIconImage(
  organizationId: string,
  file: UploadableFile
): Promise<void> {
  try {
    const fd = new FormData();
    fd.append("entity_id", organizationId);
    fd.append("entity_type", EntityType.ORGANIZATION);
    fd.append("file_object", file.file);
    await post(`/content/image_icon`, fd);
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Update

/**
 * Updates an existing image for a specific organization by sending a PUT request to the backend API with the provided image data, including the unique identifier of the image and any updated metadata. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param entityId The unique identifier of the organization for which the image is being updated.
 * @param image The image data to be updated, including the unique identifier of the image and any updated metadata such as the link URL, label, order, and associated organization ID.
 * @returns A Promise that resolves when the image has been successfully updated in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the update process.
 */
export async function updateOrganizationImage(
  entityId: string,
  image: ContentImage
): Promise<void> {
  try {
    await put(
      `/communities/organization/${entityId}/images/${image.id}`,
      image,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Fetch

/**
 * Fetches the images associated with a specific organization by sending a GET request to the backend API with the unique identifier of the organization. The function uses the get helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param entityId The unique identifier of the organization for which the images are being fetched.
 * @returns A Promise that resolves to an array of ContentImage objects representing the images associated with the specified organization.
 * @throws {AppError} if the API request fails or if there is an error during the fetching process.
 */
export async function fetchOrganizationImages(
  entityId: string
): Promise<ContentImage[]> {
  try {
    const images = (await get(`/communities/organization/${entityId}/images`, {
      withoutAuth: true,
    })) as ContentImage[];
    return images;
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

/**
 * Deletes an existing image for a specific organization by sending a DELETE request to the backend API with the provided image ID. The function uses the del helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param organizationId The unique identifier of the organization to which the image belongs.
 * @param files An array of image files to be uploaded after the existing image is deleted, including the file objects and any necessary metadata for each image file.
 * @param sequences An array of sequence numbers corresponding to the order of the image files to be uploaded after the existing image is deleted.
 * @returns A Promise that resolves when the image has been successfully deleted and the new images have been uploaded in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the upload process.
 */
export async function uploadOrganizationImages(
  organizationId: string,
  files: UploadableFile[],
  sequences: number[] = []
): Promise<ContentImage[]> {
  try {
    const fd = new FormData();
    fd.append("entity_id", organizationId);
    fd.append("entity_type", EntityType.ORGANIZATION); // backend expects EntityType.ORGANIZATION; if you have enum, adjust
    for (const s of sequences) fd.append("sequences", String(s));
    for (const f of files) fd.append("file_object", f.file);

    return await post<ContentImage[], FormData>(`/content/images`, fd);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
