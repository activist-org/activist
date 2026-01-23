// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Demonstrates using mockImplementation() on spy functions.
 * - useColorMode() is mocked in test/setup.ts as a spy function (vi.fn()).
 * - The mock is exposed as globalThis.useColorModeMock for manipulation.
 * - Individual tests use mockImplementation() to change return values per test.
 * - This pattern allows tests to set different return values for different scenarios
 *   without overriding the entire mock function. Useful when you need different
 *   return values per test and the composable is set up as a spy function.
 */
import { describe, expect, it } from "vitest";

import { useColor } from "../../app/composables/useColor";

// useColorMode mock is handled globally in test/setup.ts as a spy function.
// Individual tests can use mockImplementation() to change return values.

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
