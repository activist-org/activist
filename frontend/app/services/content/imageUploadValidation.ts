// SPDX-License-Identifier: AGPL-3.0-or-later
import { AppErrorCause } from "#shared/types/error";
import { IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE } from "#shared/utils/uploadLimits";

export const IMAGE_UPLOAD_BATCH_TOO_LARGE_MESSAGE =
  "The selected images are too large to upload together. Please remove some images and try again.";

function isImageUploadBatchTooLargeError(appError: AppError): boolean {
  if (appError.status !== 400) {
    return false;
  }

  if (appError.code === IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE) {
    return true;
  }

  if (appError.message === IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE) {
    return true;
  }

  const details = appError.details;
  if (!details || typeof details !== "object") {
    return false;
  }

  const record = details as Record<string, unknown>;
  if (record.code === IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE) {
    return true;
  }

  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : undefined;

  return nested?.code === IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE;
}

export async function validateImageUploadBatch(
  fileSizesInBytes: number[]
): Promise<void> {
  try {
    await $fetch("/api/images/validate-upload", {
      method: "POST",
      body: { fileSizesInBytes },
    });
  } catch (e) {
    const appError = errorHandler(e);

    if (isImageUploadBatchTooLargeError(appError)) {
      throw new AppError(
        IMAGE_UPLOAD_BATCH_TOO_LARGE_MESSAGE,
        AppErrorCause.VALIDATION,
        {
          status: 400,
          code: IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE,
          details: appError.details,
        }
      );
    }

    throw appError;
  }
}
