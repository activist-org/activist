// SPDX-License-Identifier: AGPL-3.0-or-later
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useGetBaseURLs", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns fixed URLs and environment-based values", async () => {
    vi.stubEnv("VITE_FRONTEND_URL", "https://frontend.example.com");
    vi.stubEnv("VITE_API_URL", "https://api.example.com/v1");
    vi.stubEnv("VITE_FRIENDLY_CAPTCHA_SITE_KEY", "friendly-captcha-key");

    const { useGetBaseURLs } =
      await import("../../../app/composables/generic/useGetBaseURLs");

    expect(useGetBaseURLs()).toEqual({
      BASE_FRONTEND_URL: "https://frontend.example.com",
      BASE_BACKEND_URL: "https://api.example.com/v1",
      ACTIVIST_URL: "https://activist.org",
      REQUEST_ACCESS_URL:
        "https://forms.activist.org/s/cm30ujrcj0003107fqc75yke8",
      FRIENDLY_CAPTCHA_KEY: "friendly-captcha-key",
    });
  });

  it("returns undefined values when environment variables are absent", async () => {
    vi.stubEnv("VITE_FRONTEND_URL", undefined as unknown as string);
    vi.stubEnv("VITE_API_URL", undefined as unknown as string);
    vi.stubEnv(
      "VITE_FRIENDLY_CAPTCHA_SITE_KEY",
      undefined as unknown as string
    );

    const { useGetBaseURLs } =
      await import("../../../app/composables/generic/useGetBaseURLs");

    const result = useGetBaseURLs();

    expect(result.BASE_FRONTEND_URL).toBeUndefined();
    expect(result.BASE_BACKEND_URL).toBeUndefined();
    expect(result.FRIENDLY_CAPTCHA_KEY).toBeUndefined();
    expect(result.ACTIVIST_URL).toBe("https://activist.org");
    expect(result.REQUEST_ACCESS_URL).toBe(
      "https://forms.activist.org/s/cm30ujrcj0003107fqc75yke8"
    );
  });
});
