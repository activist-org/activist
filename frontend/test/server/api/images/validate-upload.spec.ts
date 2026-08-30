// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import {
  IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE,
  MAX_IMAGE_SIZE_IN_BYTES,
  MAX_IMAGES_PER_UPLOAD,
  getMaxImageBatchFileBytesInBytes,
  validateImageUploadBatchSize,
} from "../../../shared/constants/uploadLimits";
import { validateUploadBodySchema } from "../../../shared/utils/imageUploadBatchValidation";

describe("server/api/images/validate-upload.post", () => {
  describe("validateUploadBodySchema", () => {
    it("accepts a valid request body", () => {
      expect(
        validateUploadBodySchema.parse({ fileSizesInBytes: [1024, 2048] })
      ).toEqual({ fileSizesInBytes: [1024, 2048] });
    });

    it("rejects an empty fileSizesInBytes array", () => {
      expect(() =>
        validateUploadBodySchema.parse({ fileSizesInBytes: [] })
      ).toThrow();
    });

    it("rejects more than MAX_IMAGES_PER_UPLOAD file sizes", () => {
      const fileSizesInBytes = Array.from(
        { length: MAX_IMAGES_PER_UPLOAD + 1 },
        () => 1
      );

      expect(() =>
        validateUploadBodySchema.parse({ fileSizesInBytes })
      ).toThrow();
    });

    it("rejects malformed request bodies", () => {
      expect(() => validateUploadBodySchema.parse({})).toThrow();
      expect(() =>
        validateUploadBodySchema.parse({ fileSizesInBytes: ["1"] })
      ).toThrow();
      expect(() =>
        validateUploadBodySchema.parse({ fileSizesInBytes: [-1] })
      ).toThrow();
    });
  });

  describe("batch validation contract", () => {
    const maxFileBytes = getMaxImageBatchFileBytesInBytes();

    it("marks an acceptable batch as valid", () => {
      const body = validateUploadBodySchema.parse({
        fileSizesInBytes: [1024],
      });
      const result = validateImageUploadBatchSize(body.fileSizesInBytes);

      expect(result.valid).toBe(true);
    });

    it("marks an exactly-at-limit batch as valid", () => {
      const fileSizesInBytes = Array.from(
        { length: MAX_IMAGES_PER_UPLOAD },
        () => MAX_IMAGE_SIZE_IN_BYTES
      );
      const body = validateUploadBodySchema.parse({ fileSizesInBytes });
      const result = validateImageUploadBatchSize(body.fileSizesInBytes);

      expect(result).toEqual({
        valid: true,
        totalFileBytes: maxFileBytes,
        maxFileBytes,
      });
    });

    it("marks an over-limit batch as invalid", () => {
      const body = validateUploadBodySchema.parse({
        fileSizesInBytes: [maxFileBytes + 1],
      });
      const result = validateImageUploadBatchSize(body.fileSizesInBytes);

      expect(result.valid).toBe(false);
      expect(result.totalFileBytes).toBe(maxFileBytes + 1);
      expect(result.maxFileBytes).toBe(maxFileBytes);
    });

    it("uses the shared batch-too-large error code in the failure contract", () => {
      expect(IMAGE_UPLOAD_BATCH_TOO_LARGE_CODE).toBe(
        "IMAGE_UPLOAD_BATCH_TOO_LARGE"
      );
    });
  });
});
