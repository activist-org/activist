// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Delete

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
