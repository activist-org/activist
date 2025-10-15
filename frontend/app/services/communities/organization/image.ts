// SPDX-License-Identifier: AGPL-3.0-or-later
import type { UploadableFile, ContentImage } from "~/types/content/file";

import { post, put, get } from "~/services/http";
import { EntityType } from "~/types/entity";
import { errorHandler } from "~/utils/errorHandler";

// MARK: Upload

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

export async function fetchGroupImages(
  entityId: string
): Promise<ContentImage[]> {
  try {
    return await get<ContentImage[]>(
      `/communities/organization/${entityId}/images`
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

export async function uploadOrganizationImages(
  organizationId: string,
  files: UploadableFile[],
  sequences: number[] = []
): Promise<ContentImage[]> {
  try {
    const fd = new FormData();
    fd.append("entity_id", organizationId);
    fd.append("entity_type", "organization"); // backend expects EntityType.ORGANIZATION; if you have enum, adjust
    for (const s of sequences) fd.append("sequences", String(s));
    for (const f of files) fd.append("file_object", f.file);

    return await post<ContentImage[], FormData>(`/content/images`, fd);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
