// SPDX-License-Identifier: AGPL-3.0-or-later
import { FetchError } from "ofetch";
import { describe, expect, it } from "vitest";

import { AppErrorCause } from "../../../shared/types/error";
import { IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE } from "../../../shared/utils/uploadLimits";
import {
  IMAGE_UPLOAD_BATCH_TOO_LARGE_MESSAGE,
  validateImageUploadBatch,
} from "../../../app/services/content/imageUploadValidation";
import { AppError } from "../../../shared/utils/errorHandler";
import { setupServiceTestMocks } from "../helpers";

function makeFetchError(
  status: number,
  data: Record<string, unknown>
): FetchError<unknown> {
  const fe = new FetchError("Bad Request") as FetchError<unknown>;
  fe.response = { status } as FetchError<unknown>["response"];
  fe.data = data;
  return fe;
}

describe("services/content/imageUploadValidation", () => {
  const getMocks = setupServiceTestMocks();

  it("calls the Nitro validation endpoint with file sizes", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ valid: true });

    await validateImageUploadBatch([1024, 2048]);

    expect(fetchMock).toHaveBeenCalledWith("/api/images/validate-upload", {
      method: "POST",
      body: { fileSizesInBytes: [1024, 2048] },
    });
  });

  it("maps batch-too-large failures to the user-facing validation message", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(
      makeFetchError(400, {
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Bad Request",
        data: {
          code: IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE,
          valid: false,
          totalFileBytes: 55_000_000,
          maxFileBytes: 52_428_800,
        },
      })
    );

    await expect(validateImageUploadBatch([55_000_000])).rejects.toMatchObject({
      name: "AppError",
      message: IMAGE_UPLOAD_BATCH_TOO_LARGE_MESSAGE,
      causeTag: AppErrorCause.VALIDATION,
      status: 400,
      code: IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE,
    } satisfies Partial<AppError>);
  });

  it("maps legacy flat batch-too-large payloads to the user-facing validation message", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(
      makeFetchError(400, {
        code: IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE,
        valid: false,
        totalFileBytes: 55_000_000,
        maxFileBytes: 52_428_800,
      })
    );

    await expect(validateImageUploadBatch([55_000_000])).rejects.toMatchObject({
      message: IMAGE_UPLOAD_BATCH_TOO_LARGE_MESSAGE,
    } satisfies Partial<AppError>);
  });
});
