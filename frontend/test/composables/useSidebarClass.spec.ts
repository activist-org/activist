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

    expect(classes["md:ps-56"]).toBe(true);
    expect(classes["md:ps-16"]).toBe(false);
    expect(classes["md:ps-60"]).toBe(false);
  });

  it("getSidebarContentDynamicClass returns scrollable classes when sidebarContentScrollable true", () => {
    const { getSidebarContentDynamicClass } = useSidebarClass();

    const classes = getSidebarContentDynamicClass(true).value;

    expect(classes["md:ps-60"]).toBe(true);
    expect(classes["md:ps-56"]).toBe(false);
  });

  it("getSidebarFooterDynamicClass returns expected classes for footer", () => {
    // Sidebar is expanded (default state).
    const { getSidebarFooterDynamicClass: getSidebarFooterDynamicClass1 } =
      useSidebarClass();
    const classes = getSidebarFooterDynamicClass1().value;
    expect(classes["md:ps-64"]).toBe(true);
    expect(classes["md:ps-24"]).toBe(false);
  });

  it("pads content on the sidebar's side in both directions", () => {
    // The sidebar sits at the inline start (`start-0`), so the content clears it with
    // `ps-*`. A `pl-*` here would leave Arabic content under the sidebar on the right.
    const { getSidebarContentDynamicClass, getSidebarFooterDynamicClass } =
      useSidebarClass();
    const keys = [
      ...Object.keys(getSidebarContentDynamicClass(false).value),
      ...Object.keys(getSidebarContentDynamicClass(true).value),
      ...Object.keys(getSidebarFooterDynamicClass().value),
    ];

    expect(keys.filter((key) => /(^|:)p[lr]-/.test(key))).toEqual([]);
  });
});
