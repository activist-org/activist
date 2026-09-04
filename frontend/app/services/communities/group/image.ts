// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Upload

export async function uploadGroupImages(
  groupId: string,
  files: UploadableFile[],
  sequences: number[] = []
): Promise<ContentImage[]> {
  try {
    if (files.length === 0)
      throw new AppError("No files provided", AppErrorCause.VALIDATION);
    await validateImageUploadBatch(files.map((file) => file.file.size));

    const fd = new FormData();
    fd.append("entity_id", groupId);
    fd.append("entity_type", EntityMap.GROUP);
    for (const s of sequences) fd.append("sequences", String(s));
    for (const f of files) fd.append("file_object", f.file);

    return await post<ContentImage[], FormData>(`/content/images`, fd);
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Update

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
