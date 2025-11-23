// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import * as reg from "../../shared/utils/imageURLRegistry.s";

describe("utils/imageURLRegistry.s", () => {
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
