// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import * as reg from "../../shared/constants/imageURLRegistry.s";

describe("constants/imageURLRegistry.s", () => {
  // MARK: URL Validation

  it("exports non-empty string URLs", () => {
    for (const [, value] of Object.entries(reg)) {
      if (typeof value === "string") {
        expect(value.length).toBeGreaterThan(1);
        expect(value.startsWith("/")).toBe(true);
      }
    }
  });
});
