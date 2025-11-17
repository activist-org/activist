// SPDX-License-Identifier: AGPL-3.0-or-later
import { post } from "~/services/http";

// MARK: Upload

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
