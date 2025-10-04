// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

import { useColor } from "../../app/composables/useColor";

mockNuxtImport("useColorMode", () => useColorModeMock);

describe("useColorModeImage", () => {
  it("adds _light to image path", () => {
    useColorModeMock.mockImplementation(() => ({
      preference: "light",
      value: "light",
    }));

    const { getColorModeImages } = useColor();
    expect(getColorModeImages("/path/to/image", ".png")).toEqual(
      "/path/to/image_light.png"
    );
  });

  it("adds _dark to image path", () => {
    // window.useColorModeMock.mockImplementation(() => ({ value: 'dark' }));

    const { getColorModeImages } = useColor();
    expect(getColorModeImages("/path/to/image", ".png")).toEqual(
      "/path/to/image_dark.png"
    );
  });

  it("uses .png as default extension", () => {
    useColorModeMock.mockImplementation(() => ({
      preference: "light",
      value: "light",
    }));

    const { getColorModeImages } = useColor();
    expect(getColorModeImages("/path/to/image")).toEqual(
      "/path/to/image_light.png"
    );
  });
});
