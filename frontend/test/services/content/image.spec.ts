// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import {
  deleteImage,
  validateImageUploadBatch,
} from "../../../app/services/content/image";
import { AppError } from "../../../shared/utils/errorHandler";
import { expectRequest, getFetchCall, setupServiceTestMocks } from "../helpers";

describe("services/content/image", () => {
  const getMocks = setupServiceTestMocks();

  // MARK: Delete

  it("deleteImage() DELETEs /content/images/:id with auth", async () => {
    const { del } = getMocks();
    del.mockResolvedValueOnce({ ok: true });

    const result = await deleteImage("img-123");

    expectRequest(del, "/content/images/img-123");
    const [, opts] = getFetchCall(del);
    expect(opts.withoutAuth).toBe(false);

    expect(result).toEqual({ ok: true });
  });

  it("deleteImage() is a no-op when imageId is empty", async () => {
    const { del } = getMocks();

    const result = await deleteImage("");

    expect(del).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("deleteImage() propagates AppError on failure", async () => {
    const { del } = getMocks();
    del.mockRejectedValueOnce(new Error("boom"));

    await expect(deleteImage("img-123")).rejects.toBeInstanceOf(AppError);
  });

  // MARK: Validate Upload Batch

  it("validateImageUploadBatch() POSTs fileSizesInBytes to /images/validate-upload", async () => {
    const { fetchImage } = getMocks();
    fetchImage.mockResolvedValueOnce(undefined);

    const fileSizesInBytes = [1024, 2048, 4096];
    await validateImageUploadBatch(fileSizesInBytes);

    expectRequest(fetchImage, "/images/validate-upload");
    const [, opts] = getFetchCall(fetchImage);
    expect(opts.baseURL).toBe("/api/images");
    expect(opts.method).toBe("POST");
    expect(opts.data).toEqual({ fileSizesInBytes });
  });

  it("validateImageUploadBatch() resolves when the batch is valid", async () => {
    const { fetchImage } = getMocks();
    fetchImage.mockResolvedValueOnce(undefined);

    await expect(validateImageUploadBatch([1, 2, 3])).resolves.toBeUndefined();
  });

  it("validateImageUploadBatch() propagates AppError on failure", async () => {
    const { fetchImage } = getMocks();
    fetchImage.mockRejectedValueOnce(new Error("file too large"));

    await expect(
      validateImageUploadBatch([Number.MAX_SAFE_INTEGER])
    ).rejects.toBeInstanceOf(AppError);
  });
});
