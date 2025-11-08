// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect, beforeEach } from "vitest";

import { getBtnDynamicClass } from "../../app/utils/btnUtils";

type TestGlobals = {
  computed: <T>(fn: () => T) => { value: T };
};

describe("utils/btnUtils", () => {
  beforeEach(() => {
    (globalThis as unknown as TestGlobals).computed = (fn) => ({ value: fn() });
  });

  // MARK: - Dynamic Class Generation

  it("returns classes for cta and font sizes", () => {
    const small = getBtnDynamicClass(true, "sm").value as Record<
      string,
      boolean
    >;
    expect(small["style-cta"]).toBe(true);
    expect(small["style-cta-secondary"]).toBe(false);
    expect(small["text-sm"]).toBe(true);

    const xl = getBtnDynamicClass(false, "xl").value as Record<string, boolean>;
    expect(xl["style-cta"]).toBe(false);
    expect(xl["style-cta-secondary"]).toBe(true);
    expect(xl["text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3"]).toBe(true);
  });
});
