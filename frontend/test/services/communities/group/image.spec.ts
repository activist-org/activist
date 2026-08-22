// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import type { ContentImage } from "../../../../shared/types/file-type";

import {
  fetchGroupImages,
  updateGroupImage,
  uploadGroupImages,
} from "../../../../app/services/communities/group/image";
import { AppError } from "../../../../shared/utils/errorHandler";
import {
  expectJsonRequest,
  expectRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../../helpers";

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

describe("services/communities/group/image", () => {
  const getMocks = setupServiceTestMocks();

  it("uploadGroupImages() posts FormData with sequences and files", async () => {
    const { post } = getMocks();
    const files = [new File(["a"], "a.png"), new File(["b"], "b.png")];
    post.mockResolvedValueOnce([]);

    await uploadGroupImages(
      "grp-1",
      files.map((f) => ({ file: f })),
      [0, 1]
    );

    const [url, opts] = getFetchCall(post);
    expect(url).toBe("/content/images");
    expect(opts.method).toBe("POST");
    expect(typeof opts.baseURL).toBe("string");
    expect(isFormData(opts.body)).toBe(true);
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
