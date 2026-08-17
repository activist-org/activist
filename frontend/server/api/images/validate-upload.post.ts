// SPDX-License-Identifier: AGPL-3.0-or-later
import { z } from "zod";

import {
  IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE,
  MAX_IMAGES_PER_UPLOAD,
  validateImageUploadBatchSize,
} from "#shared/utils/uploadLimits";

export const validateUploadBodySchema = z.object({
  fileSizesInBytes: z
    .array(z.number().int().nonnegative())
    .min(1)
    .max(MAX_IMAGES_PER_UPLOAD),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, validateUploadBodySchema.parse);
  const result = validateImageUploadBatchSize(body.fileSizesInBytes);

  if (!result.valid) {
    throw createError({
      statusCode: 400,
      statusMessage: IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE,
      data: {
        valid: false,
        code: IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE,
        totalFileBytes: result.totalFileBytes,
        maxFileBytes: result.maxFileBytes,
      },
    });
  }

  return { valid: true };
});
