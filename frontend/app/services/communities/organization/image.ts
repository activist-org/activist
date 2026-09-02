// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Upload

export async function uploadOrganizationIconImage(
  orgId: string,
  file: UploadableFile
): Promise<void> {
  try {
    const fd = new FormData();
    fd.append("entity_id", orgId);
    fd.append("entity_type", EntityMap.ORGANIZATION);
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

export async function fetchOrganizationImages(
  entityId: string
): Promise<ContentImage[]> {
  try {
    return (await get(`/communities/organization/${entityId}/images`, {
      withoutAuth: true,
    })) as ContentImage[];
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

export async function uploadOrganizationImages(
  orgId: string,
  files: UploadableFile[],
  sequences: number[] = []
): Promise<ContentImage[]> {
  try {
    const fd = new FormData();
    fd.append("entity_id", orgId);
    fd.append("entity_type", EntityMap.ORGANIZATION);
    for (const s of sequences) fd.append("sequences", String(s));
    for (const f of files) fd.append("file_object", f.file);

    return await post<ContentImage[], FormData>(`/content/images`, fd);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
