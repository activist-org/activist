// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import {
  MAX_IMAGE_SIZE_IN_BYTES,
  MAX_IMAGE_UPLOAD_REQUEST_SIZE_IN_BYTES,
  MAX_IMAGES_PER_UPLOAD,
  getMaxImageBatchFileBytesInBytes,
  validateImageUploadBatchSize,
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

  describe("validateImageUploadBatchSize", () => {
    const maxFileBytes = getMaxImageBatchFileBytesInBytes();

    it("accepts a single valid file size", () => {
      expect(validateImageUploadBatchSize([1024])).toEqual({
        valid: true,
        totalFileBytes: 1024,
        maxFileBytes,
      });
    });

    it("accepts an empty array", () => {
      expect(validateImageUploadBatchSize([])).toEqual({
        valid: true,
        totalFileBytes: 0,
        maxFileBytes,
      });
    });

    it("accepts a full batch at the maximum individual size", () => {
      const fileSizes = Array.from(
        { length: MAX_IMAGES_PER_UPLOAD },
        () => MAX_IMAGE_SIZE_IN_BYTES
      );

      expect(validateImageUploadBatchSize(fileSizes)).toEqual({
        valid: true,
        totalFileBytes: maxFileBytes,
        maxFileBytes,
      });
    });

    it("accepts a batch whose total equals the file-byte budget", () => {
      const fileSizes = [maxFileBytes];

      expect(validateImageUploadBatchSize(fileSizes)).toEqual({
        valid: true,
        totalFileBytes: maxFileBytes,
        maxFileBytes,
      });
    });

    it("rejects a batch whose total exceeds the file-byte budget", () => {
      const result = validateImageUploadBatchSize([maxFileBytes + 1]);

      expect(result).toEqual({
        valid: false,
        totalFileBytes: maxFileBytes + 1,
        maxFileBytes,
      });
    });

    it("rejects more than MAX_IMAGES_PER_UPLOAD files", () => {
      const fileSizes = Array.from(
        { length: MAX_IMAGES_PER_UPLOAD + 1 },
        () => 1
      );

      expect(validateImageUploadBatchSize(fileSizes)).toEqual({
        valid: false,
        totalFileBytes: MAX_IMAGES_PER_UPLOAD + 1,
        maxFileBytes,
      });
    });
  });
});
