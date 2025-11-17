// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import { ColorByEventType } from "../../shared/types/color";
import { colorByType } from "../../shared/utils/mapUtils";

describe("utils/mapUtils", () => {
  // MARK: - Color Mapping

  it("maps event types to color enum", () => {
    expect(colorByType.learn).toBe(ColorByEventType.LEARN);
    expect(colorByType.action).toBe(ColorByEventType.ACTION);
  });

  it("maps learn to blue color", () => {
    expect(colorByType.learn).toBe("#2176AE");
  });

  it("maps action to red color", () => {
    expect(colorByType.action).toBe("#BA3D3B");
  });

  // MARK: - Structure Validation

  it("exports exactly two event type mappings", () => {
    const keys = Object.keys(colorByType);
    expect(keys).toHaveLength(2);
    expect(keys).toContain("learn");
    expect(keys).toContain("action");
  });

  it("all mapped colors are valid hex codes", () => {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    for (const color of Object.values(colorByType)) {
      expect(color).toMatch(hexColorRegex);
    }
  });

  it("colorByType is an object with string keys and string values", () => {
    expect(typeof colorByType).toBe("object");
    for (const [key, value] of Object.entries(colorByType)) {
      expect(typeof key).toBe("string");
      expect(typeof value).toBe("string");
    }
  });

  it("color values match ColorByEventType enum values", () => {
    expect(colorByType.learn).toBe(ColorByEventType.LEARN);
    expect(colorByType.action).toBe(ColorByEventType.ACTION);
  });
});
