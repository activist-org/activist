// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ContentImage } from "../../../../shared/types/file-type";

import {
  fetchOrganizationImages,
  updateOrganizationImage,
  uploadOrganizationIconImage,
  uploadOrganizationImages,
} from "../../../../app/services/communities/organization/image";
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

describe("services/communities/organization/image", () => {
  const getMocks = setupServiceTestMocks();

  beforeEach(() => {
    validateImageUploadBatch.mockReset();
    validateImageUploadBatch.mockResolvedValue(undefined);
  });

  it("uploadOrganizationIconImage() posts FormData to image_icon", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });

    const file = new File(["abc"], "x.png", { type: "image/png" });
    await uploadOrganizationIconImage("org-1", { file });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = getFetchCall(fetchMock);
    expect(url).toBe("/content/image_icon");
    expect(opts.method).toBe("POST");
    expect(typeof opts.baseURL).toBe("string");
    expect(isFormData(opts.body)).toBe(true);
  });

  // MARK: Update

  it("updateOrganizationImage() puts JSON with content-type header", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    const img: ContentImage = {
      id: "img-1",
      url: "u",
      thumbUrl: "t",
      description: "",
      creationDate: "2025-01-01",
    } as unknown as ContentImage;

    await updateOrganizationImage("org-1", img);

    expectJsonRequest(
      fetchMock,
      "/communities/organization/org-1/images/img-1",
      "PUT",
      img
    );
  });

  it("fetchOrganizationImages() gets images using authenticated client", async () => {
    const { fetchMock } = getMocks();
    const returned: ContentImage[] = [];
    fetchMock.mockResolvedValueOnce(returned);

    const res = await fetchOrganizationImages("org-2");
    expect(res).toBe(returned);

    expectRequest(fetchMock, "/communities/organization/org-2/images", "GET");
    const [, opts] = getFetchCall(fetchMock);
    // Authorization is now added by server-side middleware, not the client helper.
    expect(opts.baseURL).toBe("/api/public");
  });

  it("uploadOrganizationImages() validates the batch before posting FormData", async () => {
    const { fetchMock } = getMocks();
    const files = [new File(["a"], "a.png"), new File(["b"], "b.png")];
    fetchMock.mockResolvedValueOnce([]);

    await uploadOrganizationImages(
      "org-3",
      files.map((f) => ({ file: f })),
      [0, 1]
    );

    expect(validateImageUploadBatch).toHaveBeenCalledWith([
      files[0].size,
      files[1].size,
    ]);
    const [url, opts] = getFetchCall(fetchMock);
    expect(url).toBe("/content/images");
    expect(opts.method).toBe("POST");
    expect(typeof opts.baseURL).toBe("string");
    expect(isFormData(opts.body)).toBe(true);
  });

  it("uploadOrganizationImages() does not upload when batch validation fails", async () => {
    const { fetchMock } = getMocks();
    validateImageUploadBatch.mockRejectedValueOnce(
      new AppError("batch too large", AppErrorCause.VALIDATION)
    );
    const files = [new File(["a"], "a.png")];

    await expect(
      uploadOrganizationImages(
        "org-3",
        files.map((f) => ({ file: f }))
      )
    ).rejects.toBeInstanceOf(AppError);

    expect(validateImageUploadBatch).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      uploadOrganizationIconImage("org-err", { file: new File(["x"], "x.png") })
    ).rejects.toBeInstanceOf(AppError);
  });
});
