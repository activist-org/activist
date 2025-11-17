// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import { useColor } from "../../app/composables/useColor";

// Note: useColorMode mock is handled globally in test/setup.ts

describe("useColorModeImage", () => {
  it("adds _light to image path", () => {
    globalThis.useColorModeMock.mockImplementation(() => ({
      preference: "light",
      value: "light",
    }));

    const { getColorModeImages } = useColor();
    expect(getColorModeImages("/path/to/image", ".png")).toEqual(
      "/path/to/image_light.png"
    );
  });

  it("adds _dark to image path", () => {
    globalThis.useColorModeMock.mockImplementation(() => ({
      preference: "dark",
      value: "dark",
    }));

    const { getColorModeImages } = useColor();
    expect(getColorModeImages("/path/to/image", ".png")).toEqual(
      "/path/to/image_dark.png"
    );
  });

  it("uses .png as default extension", () => {
    globalThis.useColorModeMock.mockImplementation(() => ({
      preference: "light",
      value: "light",
    }));

    const { getColorModeImages } = useColor();
    expect(getColorModeImages("/path/to/image")).toEqual(
      "/path/to/image_light.png"
    );
  });
});
