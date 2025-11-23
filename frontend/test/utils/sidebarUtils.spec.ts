// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it, vi } from "vitest";

type Ref<T> = { value: T };
type SidebarState = { collapsed: boolean; collapsedSwitch: boolean };

type MaybeRefBool = boolean | { value: boolean } | undefined | null;

describe("utils/sidebarUtils", () => {
  // MARK: Content and Footer Classes

  it("content/footer classes for expanded sidebar with scroll", async () => {
    vi.resetModules();
    vi.doMock("vue", () => ({
      computed: (<T>(fn: () => T) => ({ value: fn() })) as <T>(fn: () => T) => {
        value: T;
      },
    }));
    // Also provide globals in case auto-imports resolve to globals
    vi.stubGlobal("computed", (<T>(fn: () => T) => ({ value: fn() })) as <T>(
      fn: () => T
    ) => { value: T });
    vi.stubGlobal(
      "useSidebar",
      () => ({ collapsed: false, collapsedSwitch: false }) as SidebarState
    );
    vi.doMock("#imports", () => ({
      computed: (<T>(fn: () => T) => ({ value: fn() })) as <T>(fn: () => T) => {
        value: T;
      },
      useSidebar: () =>
        ({ collapsed: false, collapsedSwitch: false }) as SidebarState,
    }));
    const hover: Ref<boolean> = { value: true };
    const mod = await import("../../app/composables/useSidebarClass");
    const { getSidebarContentDynamicClass } = mod.useSidebarClass();

    const content = getSidebarContentDynamicClass(true, hover).value as Record<
      string,
      MaybeRefBool
    >;
    // Validate shape: expected class keys are present
    expect(Object.keys(content)).toEqual(
      expect.arrayContaining([
        "md:pl-16 xl:pl-56",
        "md:pl-16 xl:pl-16",
        "md:pl-20 xl:pl-60",
        "md:pl-20 xl:pl-20",
      ])
    );

    const { getSidebarFooterDynamicClass } = mod.useSidebarClass();
    const footer = getSidebarFooterDynamicClass(hover).value as Record<
      string,
      MaybeRefBool
    >;
    expect(Object.keys(footer)).toEqual(
      expect.arrayContaining(["md:pl-24 xl:pl-64", "md:pl-24 xl:pl-24"])
    );
  });

  it("content/footer classes for collapsed sidebar with scroll", async () => {
    vi.resetModules();
    vi.doMock("vue", () => ({
      computed: (<T>(fn: () => T) => ({ value: fn() })) as <T>(fn: () => T) => {
        value: T;
      },
    }));
    vi.stubGlobal("computed", (<T>(fn: () => T) => ({ value: fn() })) as <T>(
      fn: () => T
    ) => { value: T });
    vi.stubGlobal(
      "useSidebar",
      () => ({ collapsed: true, collapsedSwitch: true }) as SidebarState
    );
    vi.doMock("#imports", () => ({
      computed: (<T>(fn: () => T) => ({ value: fn() })) as <T>(fn: () => T) => {
        value: T;
      },
      useSidebar: () =>
        ({ collapsed: true, collapsedSwitch: true }) as SidebarState,
    }));
    const hover: Ref<boolean> = { value: true };
    const mod = await import("../../app/composables/useSidebarClass");
    const { getSidebarContentDynamicClass } = mod.useSidebarClass();

    const content = getSidebarContentDynamicClass(true, hover).value as Record<
      string,
      MaybeRefBool
    >;
    expect(Object.keys(content)).toEqual(
      expect.arrayContaining([
        "md:pl-16 xl:pl-56",
        "md:pl-16 xl:pl-16",
        "md:pl-20 xl:pl-60",
        "md:pl-20 xl:pl-20",
      ])
    );

    const { getSidebarFooterDynamicClass } = mod.useSidebarClass();
    const footer = getSidebarFooterDynamicClass(hover).value as Record<
      string,
      MaybeRefBool
    >;
    expect(Object.keys(footer)).toEqual(
      expect.arrayContaining(["md:pl-24 xl:pl-64", "md:pl-24 xl:pl-24"])
    );
  });
});
