// SPDX-License-Identifier: AGPL-3.0-or-later
import type { RouteLocationNormalized } from "vue-router";

import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";

// @ts-expect-error - TypeScript has issues resolving .vue files in test environment, but import works at runtime
import CardSearchResultEntityGroup from "../../../app/components/card/search-result-entity/CardSearchResultEntityGroup.vue";
import { createUseRouteMock } from "../../../mocks/composableMocks";

const mockRoute = ref<Partial<RouteLocationNormalized>>({
  path: "/test",
  fullPath: "/test",
  params: {},
  query: {},
  hash: "",
  matched: [],
  meta: {},
});

// Use factory to create useRoute mock instead of vi.mock.
// Access ref value when creating the mock.
globalThis.useRoute = createUseRouteMock(
  (mockRoute.value.params || {}) as Record<string, unknown>,
  (mockRoute.value.query || {}) as Record<string, unknown>,
  mockRoute.value.path || "/test",
  undefined
);

const createWrapper = (props: Record<string, unknown> = {}) => {
  return mount(CardSearchResultEntityGroup, {
    props: { group: {}, ...props },
    global: {
      mocks: {
        $t: (key: string, params?: Record<string, unknown>) => {
          if (key === "i18n.components._global.navigate_to_group_aria_label") {
            return "Navigate to the page for this group";
          }
          if (
            key ===
            "i18n.components.card_search_result_entity_group.group_img_alt_text"
          ) {
            return `The group logo of ${params?.entity_name || ""}.`;
          }
          return key;
        },
      },
      stubs: {
        CardSearchResultEntity: {
          name: "CardSearchResultEntity",
          template: `
                        <div
                            class="card-search-result-entity-stub"
                            :data-testid="dataTestid"
                        >
                            <div class="title">{{ title }}</div>
                            <div class="description">{{ description }}</div>
                            <slot name="menu" />
                            <slot name="desktop-meta-tags" />
                            <slot name="mobile-meta-tags" />
                        </div>
                    `,
          props: [
            "ariaLabel",
            "dataTestid",
            "description",
            "entityName",
            "iconName",
            "imageAlt",
            "imageUrl",
            "isExternalLink",
            "isReduced",
            "linkUrl",
            "title",
          ],
        },
        MenuSearchResult: {
          name: "MenuSearchResult",
          template: '<div class="menu-search-result-stub"></div>',
          props: ["group"],
        },
        MetaTagLocation: {
          name: "MetaTagLocation",
          template: '<div class="meta-tag-location-stub">{{ location }}</div>',
          props: ["location"],
        },
      },
    },
  });
};

const createMockGroup = (overrides = {}) => ({
  id: 1,
  name: "Test Group",
  groupName: "test-group",
  texts: [],
  org: { id: 1 },
  ...overrides,
});

describe("CardSearchResultEntityGroup", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // MARK: Rendering Logic

  describe("Rendering Logic", () => {
    it("renders group card", () => {
      const group = createMockGroup();
      const wrapper = createWrapper({ group });
      expect(wrapper.find('[data-testid="group-card"]').exists()).toBe(true);
    });

    it("renders group name", () => {
      const group = createMockGroup();
      const wrapper = createWrapper({ group });
      expect(wrapper.html()).toContain("Test Group");
    });

    it("renders description when available", () => {
      const group = createMockGroup({
        texts: [{ description: "Test description" }],
      });
      const wrapper = createWrapper({ group });
      expect(wrapper.vm.description).toBe("Test description");
    });

    it("renders empty description when texts array is empty", () => {
      const group = createMockGroup();
      const wrapper = createWrapper({ group });
      expect(wrapper.vm.description).toBe("");
    });

    it("renders location when location exists", () => {
      const group = createMockGroup({
        location: { addressOrName: "New York, USA" },
      });
      const wrapper = createWrapper({ group });
      expect(wrapper.findAll(".meta-tag-location-stub").length).toBeGreaterThan(
        0
      );
    });

    it("does not render location when location is undefined", () => {
      const group = createMockGroup();
      const wrapper = createWrapper({ group });
      expect(wrapper.findAll(".meta-tag-location-stub").length).toBe(0);
    });

    it("renders MenuSearchResult component", () => {
      const group = createMockGroup();
      const wrapper = createWrapper({ group });
      expect(wrapper.find(".menu-search-result-stub").exists()).toBe(true);
    });

    it("renders imageUrl when iconUrl.fileObject exists", () => {
      const group = createMockGroup({
        iconUrl: { fileObject: "https://example.com/icon.png" },
      });
      const wrapper = createWrapper({ group });
      expect(wrapper.vm.imageUrl).toBe("https://example.com/icon.png");
    });

    it("renders empty imageUrl when iconUrl is undefined", () => {
      const group = createMockGroup();
      const wrapper = createWrapper({ group });
      expect(wrapper.vm.imageUrl).toBe("");
    });
  });

  // MARK: Props & State

  describe("Props & State", () => {
    it("passes isReduced prop when true", () => {
      const mockGroup = createMockGroup();
      const wrapper = createWrapper({ group: mockGroup, isReduced: true });
      const cardStub = wrapper.findComponent({
        name: "CardSearchResultEntity",
      });

      expect(cardStub.props("isReduced")).toBe(true);
    });

    it("passes isReduced prop when false", () => {
      const mockGroup = createMockGroup();
      const wrapper = createWrapper({ group: mockGroup, isReduced: false });
      const cardStub = wrapper.findComponent({
        name: "CardSearchResultEntity",
      });

      expect(cardStub.props("isReduced")).toBe(false);
    });

    it("handles complex group with all properties", () => {
      const mockGroup = createMockGroup({
        name: "Complex Group",
        groupName: "complex-group",
        texts: [{ description: "Full description" }],
        iconUrl: { fileObject: "https://example.com/icon.png" },
        location: { addressOrName: "London, UK" },
      });
      const wrapper = createWrapper({
        group: mockGroup,
        isReduced: true,
      });

      expect(wrapper.vm.description).toBe("Full description");
      expect(wrapper.vm.imageUrl).toBe("https://example.com/icon.png");
      expect(wrapper.vm.location).toBe("London");
    });
  });

  // MARK: Accessibility

  describe("Accessibility: ARIA Attributes", () => {
    it("sets correct aria-label", () => {
      const mockGroup = createMockGroup({ name: "My Group" });
      const wrapper = createWrapper({ group: mockGroup });
      const cardStub = wrapper.findComponent({
        name: "CardSearchResultEntity",
      });

      expect(cardStub.props("ariaLabel")).toBeDefined();
      expect(typeof cardStub.props("ariaLabel")).toBe("string");
    });

    it("sets correct imageAlt with entity name", () => {
      const mockGroup = createMockGroup({ name: "My Group" });
      const wrapper = createWrapper({ group: mockGroup });
      const cardStub = wrapper.findComponent({
        name: "CardSearchResultEntity",
      });

      expect(cardStub.props("imageAlt")).toBeDefined();
      expect(cardStub.props("imageAlt")).toContain("My Group");
    });
  });

  // MARK: Styling

  describe("Styling", () => {
    it("applies reduced size classes when isReduced is true", () => {
      const mockGroup = createMockGroup({
        iconUrl: { fileObject: "https://example.com/icon.png" },
      });
      const wrapper = createWrapper({ group: mockGroup, isReduced: true });
      const cardStub = wrapper.findComponent({
        name: "CardSearchResultEntity",
      });

      expect(cardStub.props("isReduced")).toBe(true);
    });

    it("applies normal size classes when isReduced is false", () => {
      const mockGroup = createMockGroup({
        iconUrl: { fileObject: "https://example.com/icon.png" },
      });
      const wrapper = createWrapper({ group: mockGroup, isReduced: false });
      const cardStub = wrapper.findComponent({
        name: "CardSearchResultEntity",
      });

      expect(cardStub.props("isReduced")).toBe(false);
    });

    it("applies consistent styling for various group states", () => {
      const mockGroup = createMockGroup({
        name: "Styled Group",
        iconUrl: { fileObject: "https://example.com/icon.png" },
      });
      const wrapper = createWrapper({ group: mockGroup, isReduced: false });
      const cardStub = wrapper.findComponent({
        name: "CardSearchResultEntity",
      });

      expect(cardStub.props("title")).toBe("Styled Group");
      expect(cardStub.props("imageUrl")).toBe("https://example.com/icon.png");
    });
  });

  // MARK: Handling Update logic

  describe("Handling Update Logic", () => {
    it("updates description when group texts change", async () => {
      const mockGroup = createMockGroup({
        texts: [{ description: "Original" }],
      });
      const wrapper = createWrapper({ group: mockGroup });

      await wrapper.setProps({
        group: createMockGroup({
          texts: [{ description: "Updated" }],
        }),
      });
      await nextTick();

      expect(wrapper.vm.description).toBe("Updated");
    });

    it("updates imageUrl when iconUrl changes", async () => {
      const mockGroup = createMockGroup({
        iconUrl: { fileObject: "https://example.com/old.png" },
      });
      const wrapper = createWrapper({ group: mockGroup });

      await wrapper.setProps({
        group: createMockGroup({
          iconUrl: { fileObject: "https://example.com/new.png" },
        }),
      });
      await nextTick();

      expect(wrapper.vm.imageUrl).toBe("https://example.com/new.png");
    });

    it("updates location when group location changes", async () => {
      const mockGroup = createMockGroup({
        location: { addressOrName: "Paris, France" },
      });
      const wrapper = createWrapper({ group: mockGroup });

      await wrapper.setProps({
        group: createMockGroup({
          location: { addressOrName: "Berlin, Germany" },
        }),
      });
      await nextTick();

      expect(wrapper.vm.location).toBe("Berlin");
    });
  });

  // MARK: Edge Cases

  describe("Edge Cases", () => {
    it("handles location with multiple commas", () => {
      const mockGroup = createMockGroup({
        location: {
          addressOrName: "123 Main St, Suite 100, New York, NY, USA",
        },
      });
      const wrapper = createWrapper({ group: mockGroup });

      expect(wrapper.vm.location).toBe("123 Main St");
    });

    it("handles empty group name", () => {
      const mockGroup = createMockGroup({ name: "" });
      const wrapper = createWrapper({ group: mockGroup });
      const cardStub = wrapper.findComponent({
        name: "CardSearchResultEntity",
      });

      expect(cardStub.props("title")).toBe("");
    });

    it("uses first description when multiple exist", () => {
      const mockGroup = createMockGroup({
        texts: [
          { description: "First description" },
          { description: "Second description" },
        ],
      });
      const wrapper = createWrapper({ group: mockGroup });

      expect(wrapper.vm.description).toBe("First description");
    });
  });
});
