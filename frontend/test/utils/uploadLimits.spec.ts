// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import {
  MAX_IMAGE_SIZE_IN_BYTES,
  MAX_IMAGE_UPLOAD_REQUEST_SIZE_IN_BYTES,
  MAX_IMAGES_PER_UPLOAD,
} from "../../shared/utils/uploadLimits";

describe("utils/uploadLimits", () => {
  it("mirrors the backend's per-image limit", () => {
    // IMAGE_UPLOAD_MAX_FILE_SIZE in backend/core/settings.py.
    expect(MAX_IMAGE_SIZE_IN_BYTES).toBe(5 * 1024 * 1024);
  });

  it("leaves an oversized single image to the backend to reject", () => {
    // The smallest file the backend refuses has to survive the edge guard,
    // otherwise the user gets a 413 instead of the message naming the limit.
    // https://github.com/activist-org/activist/issues/2332
    expect(MAX_IMAGE_UPLOAD_REQUEST_SIZE_IN_BYTES).toBeGreaterThan(
      MAX_IMAGE_SIZE_IN_BYTES + 1
    );
  });

  it("admits a full batch of images the backend would accept", () => {
    // The guard measures the whole request, so a batch of individually valid
    // images must not trip it -- 5000000 bytes did, blocking two 3MB uploads.
    expect(MAX_IMAGE_UPLOAD_REQUEST_SIZE_IN_BYTES).toBeGreaterThan(
      MAX_IMAGES_PER_UPLOAD * MAX_IMAGE_SIZE_IN_BYTES
    );
  });
});
