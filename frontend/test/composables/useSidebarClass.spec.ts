// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for the useSidebarClass functionality.
 */
import { describe, expect, it } from "vitest";

import { useSidebarClass } from "../../app/composables/useSidebarClass";

describe("useSidebarClass", () => {
  it("getSidebarContentDynamicClass returns expanded classes when expanded and not scrollable", () => {
    const { getSidebarContentDynamicClass } = useSidebarClass();

    const classes = getSidebarContentDynamicClass(false).value;

    expect(classes["md:pl-56"]).toBe(true);
    expect(classes["md:pl-16"]).toBe(false);
    expect(classes["md:pl-60"]).toBe(false);
  });

  it("getSidebarContentDynamicClass returns scrollable classes when sidebarContentScrollable true", () => {
    const { getSidebarContentDynamicClass } = useSidebarClass();

    const classes = getSidebarContentDynamicClass(true).value;

    expect(classes["md:pl-60"]).toBe(true);
    expect(classes["md:pl-56"]).toBe(false);
  });

  it("getSidebarFooterDynamicClass returns expected classes for footer", () => {
    // Sidebar is expanded (default state).
    const { getSidebarFooterDynamicClass: getSidebarFooterDynamicClass1 } =
      useSidebarClass();
    const classes = getSidebarFooterDynamicClass1().value;
    expect(classes["md:pl-64"]).toBe(true);
    expect(classes["md:pl-24"]).toBe(false);
  });
});
