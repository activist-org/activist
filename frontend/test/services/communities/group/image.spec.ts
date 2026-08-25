// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ContentImage } from "../../../../shared/types/file-type";

import {
  fetchGroupImages,
  updateGroupImage,
  uploadGroupImages,
} from "../../../../app/services/communities/group/image";
import { AppErrorCause } from "../../../../shared/types/error";
import { AppError } from "../../../../shared/utils/errorHandler";
import {
  expectJsonRequest,
  expectRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../../helpers";

const validateImageUploadBatch = vi.fn();

vi.mock("../../../../app/services/content/imageUploadValidation", () => ({
  validateImageUploadBatch: (...args: unknown[]) =>
    validateImageUploadBatch(...args),
}));

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

describe("services/communities/group/image", () => {
  const getMocks = setupServiceTestMocks();

  beforeEach(() => {
    validateImageUploadBatch.mockReset();
    validateImageUploadBatch.mockResolvedValue(undefined);
  });

  it("uploadGroupImages() validates the batch before posting FormData", async () => {
    const { post } = getMocks();
    const files = [new File(["a"], "a.png"), new File(["b"], "b.png")];
    post.mockResolvedValueOnce([]);

    await uploadGroupImages(
      "grp-1",
      files.map((f) => ({ file: f })),
      [0, 1]
    );

    expect(validateImageUploadBatch).toHaveBeenCalledWith([
      files[0].size,
      files[1].size,
    ]);
    const [url, opts] = getFetchCall(post);
    expect(url).toBe("/content/images");
    expect(opts.method).toBe("POST");
    expect(typeof opts.baseURL).toBe("string");
    expect(isFormData(opts.body)).toBe(true);
  });

  it("uploadGroupImages() does not upload when batch validation fails", async () => {
    const { fetchMock } = getMocks();
    validateImageUploadBatch.mockRejectedValueOnce(
      new AppError("batch too large", AppErrorCause.VALIDATION)
    );
    const files = [new File(["a"], "a.png")];

    await expect(
      uploadGroupImages(
        "grp-1",
        files.map((f) => ({ file: f }))
      )
    ).rejects.toBeInstanceOf(AppError);

    expect(validateImageUploadBatch).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  // MARK: Update

  it("updateGroupImage() puts JSON with content-type header", async () => {
    const { put } = getMocks();
    put.mockResolvedValueOnce({ ok: true });
    const img: ContentImage = {
      id: "img-1",
      url: "u",
      thumbUrl: "t",
      description: "",
      creationDate: "2025-01-01",
    } as unknown as ContentImage;

    await updateGroupImage("grp-2", img);

    expectJsonRequest(put, "/communities/group/grp-2/images/img-1", "PUT", img);
  });

  it("fetchGroupImages() gets images using authenticated client", async () => {
    const { get } = getMocks();
    const returned: ContentImage[] = [];
    get.mockResolvedValueOnce(returned);

    const res = await fetchGroupImages("grp-3");
    expect(res).toBe(returned);

    expectRequest(get, "/communities/group/grp-3/images", "GET");
    const [, opts] = getFetchCall(get);
    // Authorization is now added by server-side middleware, not the client helper.
    expect(opts.baseURL).toBe("/api/public");
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { post } = getMocks();
    post.mockRejectedValueOnce(new Error("boom"));
    await expect(uploadGroupImages("grp-err", [])).rejects.toBeInstanceOf(
      AppError
    );
  });
});
