// SPDX-License-Identifier: AGPL-3.0-or-later
import useColorModeImages from "@/composables/useColorModeImages";

import { mockNuxtImport } from "@nuxt/test-utils/runtime";

mockNuxtImport("useColorMode", () => useColorModeMock);

describe("useColorModeImage", () => {
  it("adds _light to image path", () => {
    useColorModeMock.mockImplementation(() => ({
      preference: "light",
      value: "light",
    }));

    const getImage = useColorModeImages();
    expect(getImage("/path/to/image", ".png")).toEqual(
      "/path/to/image_light.png"
    );
  });

  it("adds _dark to image path", () => {
    // window.useColorModeMock.mockImplementation(() => ({ value: 'dark' }));

    const getImage = useColorModeImages();
    expect(getImage("/path/to/image", ".png")).toEqual(
      "/path/to/image_dark.png"
    );
  });

  it("uses .png as default extension", () => {
    useColorModeMock.mockImplementation(() => ({
      preference: "light",
      value: "light",
    }));

    const getImage = useColorModeImages();
    expect(getImage("/path/to/image")).toEqual("/path/to/image_light.png");
  });
});
