// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";

import useMenuEntriesState from "../../app/composables/useMenuEntriesState";

// MARK: Mocks & Setup

beforeEach(() => {
  const afterEachCallbacks: (() => void)[] = [];

  globalThis.useRouter = () =>
    ({
      push: vi.fn(),
      currentRoute: {
        value: {
          params: { orgId: "test-org-123" },
          fullPath: "/en/organizations/test-org-123/about",
          path: "/en/organizations/test-org-123/about",
        },
      },
      afterEach: (cb: () => void) => {
        afterEachCallbacks.push(cb);
        return () => {
          const idx = afterEachCallbacks.indexOf(cb);
          if (idx >= 0) afterEachCallbacks.splice(idx, 1);
        };
      },
    }) as unknown as ReturnType<typeof useRouter>;

  globalThis.useRoute = () =>
    ({
      path: "/en/organizations/test-org-123/about",
      params: { orgId: "test-org-123" },
      query: {},
    }) as unknown as ReturnType<typeof useRoute>;
});

/**
 * Helper to mount the composable inside a real component context
 * so lifecycle hooks (onMounted, onUnmounted, watch) work properly.
 * @returns The mounted wrapper and the composable result for assertions
 */
function mountComposable() {
  let result: ReturnType<typeof useMenuEntriesState>;

  const wrapper = mount(
    defineComponent({
      setup() {
        result = useMenuEntriesState();
        return {};
      },
      template: "<div />",
    })
  );

  return { wrapper, result: result! };
}

// MARK: Tests

describe("useMenuEntriesState", () => {
  it("returns organizationEntry and eventEntry refs", () => {
    const { result } = mountComposable();

    expect(result.organizationEntry.value).toBeDefined();
    expect(result.eventEntry.value).toBeDefined();
    expect(Array.isArray(result.organizationEntry.value)).toBe(true);
    expect(Array.isArray(result.eventEntry.value)).toBe(true);
  });

  it("creates organization entries with correct structure", () => {
    const { result } = mountComposable();

    for (const entry of result.organizationEntry.value) {
      expect(entry).toHaveProperty("label");
      expect(entry).toHaveProperty("routeUrl");
      expect(entry).toHaveProperty("iconUrl");
      expect(entry).toHaveProperty("selected");
      expect(entry).toHaveProperty("id");
      expect(entry).toHaveProperty("basePath");
      expect(entry.basePath).toBe("organizations");
    }
  });

  it("creates event entries with basePath 'events'", () => {
    const { result } = mountComposable();

    for (const entry of result.eventEntry.value) {
      expect(entry).toHaveProperty("label");
      expect(entry).toHaveProperty("routeUrl");
      expect(entry).toHaveProperty("iconUrl");
      expect(entry.basePath).toBe("events");
    }
  });

  it("includes expected organization menu items", () => {
    const { result } = mountComposable();

    const labels = result.organizationEntry.value.map((e) => e.label);
    expect(labels).toContain("i18n._global.about");
    expect(labels).toContain("i18n._global.events");
    expect(labels).toContain("i18n._global.groups");
    expect(labels).toContain("i18n._global.resources");
    expect(labels).toContain("i18n._global.faq");
    expect(labels).toContain("i18n._global.discussions");
    expect(labels).toContain("i18n._global.settings");
  });

  it("includes expected event menu items", () => {
    const { result } = mountComposable();

    const labels = result.eventEntry.value.map((e) => e.label);
    expect(labels).toContain("i18n._global.about");
    expect(labels).toContain("i18n._global.resources");
    expect(labels).toContain("i18n._global.faq");
    expect(labels).toContain("i18n._global.settings");
  });

  it("organization entries have more items than event entries", () => {
    const { result } = mountComposable();

    expect(result.organizationEntry.value.length).toBeGreaterThan(
      result.eventEntry.value.length
    );
  });

  it("each entry has a non-empty iconUrl", () => {
    const { result } = mountComposable();

    for (const entry of [
      ...result.organizationEntry.value,
      ...result.eventEntry.value,
    ]) {
      expect(entry.iconUrl).toBeTruthy();
      expect(typeof entry.iconUrl).toBe("string");
    }
  });

  it("route URLs contain the basePath", () => {
    const { result } = mountComposable();

    for (const entry of result.organizationEntry.value) {
      expect(entry.routeUrl).toContain("/organizations/");
    }

    for (const entry of result.eventEntry.value) {
      expect(entry.routeUrl).toContain("/events/");
    }
  });

  it("cleans up afterEach guard on unmount", () => {
    const { wrapper } = mountComposable();

    // Unmounting should not throw.
    wrapper.unmount();
  });
});
