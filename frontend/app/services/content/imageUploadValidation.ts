// SPDX-License-Identifier: AGPL-3.0-or-later
import { AppErrorCause } from "#shared/types/error";
import { IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE } from "#shared/utils/uploadLimits";

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

    if (
      appError.status === 400 &&
      (appError.details as { code?: string } | undefined)?.code ===
        IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE
    ) {
      const { t } = useI18n();
      throw new AppError(
        t("i18n.components.use_file_manager.batch_too_large"),
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
