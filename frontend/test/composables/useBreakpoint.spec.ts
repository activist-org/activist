// SPDX-License-Identifier: AGPL-3.0-or-later
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useBreakpoint from "../../app/composables/generic/useBreakpoint";

describe("useBreakpoint composable", () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    vi.stubGlobal("window", {
      innerWidth: 800,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    globalThis.window = originalWindow;
  });

  it("returns true when width matches small breakpoint", () => {
    globalThis.window.innerWidth = 500;
    const isSmall = useBreakpoint("sm");
    expect(isSmall.value).toBe(true);
  });

  it("returns true when width matches medium breakpoint", () => {
    globalThis.window.innerWidth = 800;
    const isMedium = useBreakpoint("md");
    expect(isMedium.value).toBe(true);
  });

  it("returns true when width matches large breakpoint", () => {
    globalThis.window.innerWidth = 1200;
    const isLarge = useBreakpoint("lg");
    expect(isLarge.value).toBe(true);
  });
});
