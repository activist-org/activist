// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE,
  validateImageUploadBatchSize,
} from "#shared/utils/uploadLimits";
import { validateUploadBodySchema } from "#shared/utils/imageUploadBatchValidation";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, validateUploadBodySchema.parse);
  const result = validateImageUploadBatchSize(body.fileSizesInBytes);

  if (!result.valid) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
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
