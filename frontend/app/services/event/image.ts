// SPDX-License-Identifier: AGPL-3.0-or-later
import type { UploadableFile } from "~/types/content/file";

import { post } from "~/services/http";
import { EntityType } from "~/types/entity";
import { errorHandler } from "~/utils/errorHandler";

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
