// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import { FRIENDLY_CAPTCHA_KEY } from "../../app/constants/baseUrls";

describe("constants/captcha", () => {
  // MARK: Environment Variable

  it("exposes FRIENDLY_CAPTCHA_KEY as string or undefined from env", () => {
    if (FRIENDLY_CAPTCHA_KEY !== undefined) {
      expect(typeof FRIENDLY_CAPTCHA_KEY).toBe("string");
    } else {
      expect(FRIENDLY_CAPTCHA_KEY).toBeUndefined();
    }
  });

  // MARK: Validation

  it("FRIENDLY_CAPTCHA_KEY is non-empty string when defined", () => {
    if (FRIENDLY_CAPTCHA_KEY !== undefined) {
      expect(FRIENDLY_CAPTCHA_KEY.length).toBeGreaterThan(0);
      expect(FRIENDLY_CAPTCHA_KEY.trim()).toBe(FRIENDLY_CAPTCHA_KEY);
    } else {
      // Test passes if undefined (env var not set in test environment)
      expect(FRIENDLY_CAPTCHA_KEY).toBeUndefined();
    }
  });

  it("FRIENDLY_CAPTCHA_KEY does not contain whitespace when defined", () => {
    if (FRIENDLY_CAPTCHA_KEY !== undefined) {
      expect(FRIENDLY_CAPTCHA_KEY).not.toMatch(/\s/);
    } else {
      expect(FRIENDLY_CAPTCHA_KEY).toBeUndefined();
    }
  });

  it("FRIENDLY_CAPTCHA_KEY type is consistent", () => {
    const keyType = typeof FRIENDLY_CAPTCHA_KEY;
    expect(["string", "undefined"]).toContain(keyType);
  });

  it("FRIENDLY_CAPTCHA_KEY is not null", () => {
    expect(FRIENDLY_CAPTCHA_KEY).not.toBeNull();
  });

  it("FRIENDLY_CAPTCHA_KEY is not an empty string when defined", () => {
    if (typeof FRIENDLY_CAPTCHA_KEY === "string") {
      expect(FRIENDLY_CAPTCHA_KEY).not.toBe("");
    } else {
      expect(FRIENDLY_CAPTCHA_KEY).toBeUndefined();
    }
  });
});
