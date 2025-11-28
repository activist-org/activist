// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import {
  ACTIVIST_URL,
  BASE_FRONTEND_URL,
  BASE_BACKEND_URL,
  BASE_BACKEND_URL_NO_V1,
  REQUEST_ACCESS_URL,
} from "../../app/constants/baseUrls";

describe("constants/baseUrls", () => {
  // MARK: Fixed Constants

  it("exports fixed constants for activist and request access", () => {
    expect(ACTIVIST_URL).toBe("https://activist.org");
    expect(REQUEST_ACCESS_URL).toBe(
      "https://forms.activist.org/s/cm30ujrcj0003107fqc75yke8"
    );
  });

  // MARK: Environment Variables

  it("exposes environment-derived URLs as strings or undefined", () => {
    // In test, these may be undefined depending on Vite env; only assert type surface.
    const candidates = [
      BASE_FRONTEND_URL,
      BASE_BACKEND_URL,
      BASE_BACKEND_URL_NO_V1,
    ];
    for (const c of candidates) {
      if (c !== undefined) {
        expect(typeof c).toBe("string");
      } else {
        expect(c).toBeUndefined();
      }
    }
  });
});
