// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import { uploadEventIconImage } from "../../../app/services/event/image";
import { AppError } from "../../../app/utils/errorHandler";
import { getFetchCall, setupServiceTestMocks } from "../helpers";

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

describe("services/event/image", () => {
  const getMocks = setupServiceTestMocks();

  it("uploadEventIconImage() posts FormData to image_icon", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    const file = new File(["x"], "x.png", { type: "image/png" });

    await uploadEventIconImage("evt-1", { file });

    const [url, opts] = getFetchCall(fetchMock);
    expect(url).toBe("/content/image_icon");
    expect(opts.method).toBe("POST");
    expect(typeof opts.baseURL).toBe("string");
    expect(isFormData(opts.body)).toBe(true);
  });

  // MARK: - Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      uploadEventIconImage("evt-err", { file: new File(["x"], "x.png") })
    ).rejects.toBeInstanceOf(AppError);
  });
});
