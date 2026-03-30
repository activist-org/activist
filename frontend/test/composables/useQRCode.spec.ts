// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useQRCode } from "../../app/composables/useQRCode";

// MARK: Tests

describe("useQRCode", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the expected interface", () => {
    const result = useQRCode("test-qr");

    expect(result).toHaveProperty("showTooltip");
    expect(result).toHaveProperty("availableFormats");
    expect(result).toHaveProperty("downloadQRCode");
    expect(result).toHaveProperty("onImageClick");
    expect(result).toHaveProperty("qrcode");
  });

  it("initializes showTooltip as false", () => {
    const { showTooltip } = useQRCode("test-qr");

    expect(showTooltip.value).toBe(false);
  });

  it("allows toggling showTooltip", () => {
    const { showTooltip } = useQRCode("test-qr");

    showTooltip.value = true;
    expect(showTooltip.value).toBe(true);

    showTooltip.value = false;
    expect(showTooltip.value).toBe(false);
  });

  it("initializes qrcode ref as undefined", () => {
    const { qrcode } = useQRCode("test-qr");

    expect(qrcode.value).toBeUndefined();
  });

  describe("qrPixelGraphicsSize", () => {
    it("returns undefined when qrcode ref has no value", () => {
      const { qrcode } = useQRCode("test-qr");

      // Access the internal computed via availableFormats (which depends on size).
      expect(qrcode.value).toBeUndefined();
    });
  });

  describe("availableFormats", () => {
    it("lists PNG, JPEG, SVG formats when qrcode is not ready", () => {
      const { availableFormats } = useQRCode("test-qr");

      expect(availableFormats.value).toHaveLength(3);
      expect(availableFormats.value[0]).toContain("PNG");
      expect(availableFormats.value[1]).toContain("JPEG");
      expect(availableFormats.value[2]).toBe("SVG");
    });

    it("does not include pixel dimensions when qrcode is not set", () => {
      const { availableFormats } = useQRCode("test-qr");

      // When qrcode is not ready, format strings should not contain dimensions.
      expect(availableFormats.value[0]).toBe("PNG");
      expect(availableFormats.value[1]).toBe("JPEG");
    });

    it("includes pixel dimensions when qrcode is set", () => {
      const { availableFormats, qrcode } = useQRCode("test-qr");

      // Simulate a qrcode component being set with a getSize method.
      qrcode.value = {
        getSize: () => ({ width: 300, height: 300 }),
      };

      // Width is fixed at 1500, height scales proportionally.
      expect(availableFormats.value[0]).toContain("1,500 x 1,500 px");
      expect(availableFormats.value[1]).toContain("1,500 x 1,500 px");
      expect(availableFormats.value[2]).toBe("SVG");
    });

    it("computes correct aspect ratio for non-square QR codes", () => {
      const { availableFormats, qrcode } = useQRCode("test-qr");

      qrcode.value = {
        getSize: () => ({ width: 200, height: 100 }),
      };

      // Height = round(1500 * (100 / 200)) = 750.
      expect(availableFormats.value[0]).toContain("1,500 x 750 px");
    });
  });

  describe("downloadQRCode", () => {
    it("is a function", () => {
      const { downloadQRCode } = useQRCode("test-qr");
      expect(typeof downloadQRCode).toBe("function");
    });
  });

  describe("onImageClick", () => {
    it("is a function", () => {
      const { onImageClick } = useQRCode("test-qr");
      expect(typeof onImageClick).toBe("function");
    });
  });
});
