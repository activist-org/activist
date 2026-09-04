// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Delete

export async function deleteImage(imageId: string) {
  if (!imageId) {
    return;
  }

  try {
    return await del(`/content/images/${imageId}`, { withoutAuth: false });
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Validate Upload Batch

export async function validateImageUploadBatch(
  fileSizesInBytes: number[]
): Promise<void> {
  try {
    await fetchImage("/images/validate-upload", { fileSizesInBytes }, "POST");
  } catch (e) {
    throw errorHandler(e);
  }
}
