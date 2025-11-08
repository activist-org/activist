// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import type { ContentImage } from "../../../../app/types/content/file";

import {
  uploadOrganizationIconImage,
  updateOrganizationImage,
  fetchOrganizationImages,
  uploadOrganizationImages,
} from "../../../../app/services/communities/organization/image";
import { AppError } from "../../../../app/utils/errorHandler";
import {
  expectJsonRequest,
  expectRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../../helpers";

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

describe("services/communities/organization/image", () => {
  const getMocks = setupServiceTestMocks();

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

  // MARK: - Update

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

  it("fetchOrganizationImages() gets images and includes Authorization by default", async () => {
    const { fetchMock } = getMocks();
    const returned: ContentImage[] = [];
    fetchMock.mockResolvedValueOnce(returned);

    const res = await fetchOrganizationImages("org-2");
    expect(res).toBe(returned);

    expectRequest(fetchMock, "/communities/organization/org-2/images", "GET");
    const [, opts] = getFetchCall(fetchMock);
    expect(opts.headers?.Authorization).toBe("Bearer test-token");
  });

  it("uploadOrganizationImages() posts FormData with sequences and files", async () => {
    const { fetchMock } = getMocks();
    const files = [new File(["a"], "a.png"), new File(["b"], "b.png")];
    fetchMock.mockResolvedValueOnce([]);

    await uploadOrganizationImages(
      "org-3",
      files.map((f) => ({ file: f })),
      [0, 1]
    );

    const [url, opts] = getFetchCall(fetchMock);
    expect(url).toBe("/content/images");
    expect(opts.method).toBe("POST");
    expect(typeof opts.baseURL).toBe("string");
    expect(isFormData(opts.body)).toBe(true);
  });

  // MARK: - Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      uploadOrganizationIconImage("org-err", { file: new File(["x"], "x.png") })
    ).rejects.toBeInstanceOf(AppError);
  });
});
