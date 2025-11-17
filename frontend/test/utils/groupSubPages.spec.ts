// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect, vi } from "vitest";

describe("utils/groupSubPages", () => {
  // MARK: - Tab Generation

  it("getGroupTabs builds tabs with i18n labels and org/group params", async () => {
    vi.resetModules();
    vi.doMock("#imports", () => ({
      useI18n: () => ({ t: (k: string) => k.split(".").pop() ?? k }),
      useRoute: () => ({ params: { orgId: "o1", groupId: "g1" } }),
    }));
    Object.assign(globalThis, {
      useRoute: () => ({ params: { orgId: "o1", groupId: "g1" } }),
    });
    const mod = await import("../../app/composables/useGetGroupTabs");
    const tabs = mod.useGetGroupTabs();
    expect(tabs).toHaveLength(4);
    expect(tabs[0]!.label.toLowerCase()).toBe("about");
    expect(tabs[1]!.label.toLowerCase()).toBe("events");
    expect(tabs[2]!.label.toLowerCase()).toBe("resources");
    expect(tabs[3]!.label.toLowerCase()).toBe("faq");
    // Only assert structural shape to avoid coupling to router env
    expect(tabs[0]!.routeUrl.endsWith("/about")).toBe(true);
    expect(tabs[1]!.routeUrl.endsWith("/events")).toBe(true);
    expect(tabs[2]!.routeUrl.endsWith("/resources")).toBe(true);
    expect(tabs[3]!.routeUrl.endsWith("/faq")).toBe(true);
    for (const t of tabs) {
      expect(t.routeUrl.includes("/organizations/")).toBe(true);
      expect(t.routeUrl.includes("/groups/")).toBe(true);
    }
  });
});
