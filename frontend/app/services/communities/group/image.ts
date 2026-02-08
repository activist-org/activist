// SPDX-License-Identifier: AGPL-3.0-or-later
import { post, put } from "~/services/http";

// MARK: Upload

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
    const images = (await fetchImages(
      `/communities/group/${entityId}`,
      {}
    )) as ContentImage[];
    return images;
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
