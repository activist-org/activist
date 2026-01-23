// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for the useSidebarClass functionality.
 */
import { describe, expect, it } from "vitest";
import { ref } from "vue";

import { useSidebarClass } from "../../app/composables/useSidebarClass";

describe("useSidebarClass", () => {
  it("getSidebarContentDynamicClass returns expanded classes when expanded and not scrollable", () => {
    const { getSidebarContentDynamicClass } = useSidebarClass();

    const sidebarHover = ref(false);
    const classes = getSidebarContentDynamicClass(false, sidebarHover).value;

    expect(classes["md:pl-16 xl:pl-56"]).toBe(true);
    expect(classes["md:pl-20 xl:pl-60"]).toBe(false);
    expect(classes["blur-sm xl:blur-none"]).toBe(false);
  });

  it("getSidebarContentDynamicClass returns scrollable classes when sidebarContentScrollable true", () => {
    const { getSidebarContentDynamicClass } = useSidebarClass();

    const sidebarHover = ref(false);
    const classes = getSidebarContentDynamicClass(true, sidebarHover).value;

    expect(classes["md:pl-20 xl:pl-60"]).toBe(true);
    expect(classes["md:pl-16 xl:pl-56"]).toBe(true);
  });

  it("getSidebarContentDynamicClass returns blur when collapsedSwitch true, not collapsed and hovered", () => {
    // Set state to collapsedSwitch true but not collapsed.
    globalThis.useSidebarMock.mockImplementation(() => ({
      collapsed: false,
      collapsedSwitch: true,
    }));
    const { getSidebarContentDynamicClass } = useSidebarClass();

    const sidebarHover = ref(true);
    const classes = getSidebarContentDynamicClass(false, sidebarHover).value;

    expect(classes["blur-sm xl:blur-none"]).toBe(true);
  });

  it("getSidebarFooterDynamicClass returns expected classes for footer", () => {
    const sidebarHover = ref(false);

    // Sidebar is expanded (default state).
    const { getSidebarFooterDynamicClass: getSidebarFooterDynamicClass1 } =
      useSidebarClass();
    const classes = getSidebarFooterDynamicClass1(sidebarHover).value;
    expect(classes["md:pl-24 xl:pl-64"]).toBe(true);
    expect(classes["blur-sm xl:blur-none"]).toBe(false);

    // Simulate hovered state with collapsedSwitch true and not collapsed.
    // Blur is applied when: collapsedSwitch && !collapsed && hovered
    globalThis.useSidebarMock.mockImplementation(() => ({
      collapsed: false, // Sidebar expanded due to hover
      collapsedSwitch: true, // Toggle is in closed mode
    }));
    sidebarHover.value = true;
    // Need to call useSidebarClass again to get fresh computed that reads updated mock
    const { getSidebarFooterDynamicClass: getSidebarFooterDynamicClass2 } =
      useSidebarClass();
    const classesAfter = getSidebarFooterDynamicClass2(sidebarHover).value;
    expect(classesAfter["blur-sm xl:blur-none"]).toBe(true);
  });
});
