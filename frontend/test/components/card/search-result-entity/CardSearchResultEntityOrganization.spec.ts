// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";
import type { RouteLocationNormalized } from "vue-router";

import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";

// @ts-expect-error - TypeScript has issues resolving .vue files in test environment, but import works at runtime
import CardSearchResultEntityOrganization from "../../../app/components/card/search-result-entity/CardSearchResultEntityOrganization.vue";
import { createUseRouteMock } from "../../../mocks/composableMocks";

// MARK: Mock composables & state

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

vi.mock("../../../app/composables/useLinkURL", () => ({
  useLinkURL: () => ({ linkUrl: ref("/test-link-url") }),
}));

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      if (
        key === "i18n.components._global.navigate_to_organization_aria_label"
      ) {
        return "Navigate to the page for this organization";
      }
      if (
        key ===
        "i18n.components.card_search_result_entity_organization.organization_img_alt_text"
      ) {
        return `The organization logo of ${params?.entity_name || ""}.`;
      }
      return key;
    },
  }),
  createI18n: vi.fn(),
}));

vi.mock("../../../app/utils/IconMap", () => ({
  IconMap: { ORGANIZATION: "IconOrganization" },
}));

// MARK: Stubs & Helpers

const createWrapper = (props: Record<string, unknown> = {}) =>
  mount(CardSearchResultEntityOrganization, {
    props: { organization: {}, ...props },
    global: {
      stubs: {
        CardSearchResultEntity: {
          name: "CardSearchResultEntity",
          template: `
            <div class="card-search-result-entity-stub" :data-testid="dataTestid">
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
          template:
            '<div class="menu-search-result-stub max-md:absolute max-md:right-0 max-md:top-0"></div>',
          props: ["organization"],
        },
        MetaTagLocation: {
          name: "MetaTagLocation",
          template: '<div class="meta-tag-location-stub">{{ location }}</div>',
          props: ["location"],
        },
      },
    },
  });

const createMockOrganization = (overrides = {}) => ({
  id: 1,
  name: "Test Organization",
  orgName: "test-organization",
  texts: [],
  org: { id: 1 },
  ...overrides,
});

// MARK: Reusable Assertions

const getCardProps = (wrapper: VueWrapper) =>
  wrapper.findComponent({ name: "CardSearchResultEntity" }).props();

const getMenuStub = (wrapper: VueWrapper) =>
  wrapper.findComponent({ name: "MenuSearchResult" });

const getMetaTagCount = (wrapper: VueWrapper) =>
  wrapper.findAllComponents({ name: "MetaTagLocation" }).length;

// MARK: Tests

describe("CardSearchResultEntityOrganization", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // MARK: Rendering

  describe("Rendering", () => {
    it("renders organization name and passes correct props", () => {
      wrapper = createWrapper({
        organization: createMockOrganization({
          name: "Awesome Org",
          orgName: "awesome-org",
        }),
      });
      const props = getCardProps(wrapper);

      expect(wrapper.text()).toContain("Awesome Org");
      expect(props.title).toBe("Awesome Org");
      expect(props.entityName).toBe("awesome-org");
      expect(props.isExternalLink).toBe(false);
    });

    it("renders description when available", () => {
      wrapper = createWrapper({
        organization: createMockOrganization({
          texts: [{ description: "This is a test description" }],
        }),
      });
      expect(getCardProps(wrapper).description).toBe(
        "This is a test description"
      );
    });

    it("renders empty description when texts array is empty", () => {
      wrapper = createWrapper({
        organization: createMockOrganization({ texts: [] }),
      });
      expect(getCardProps(wrapper).description).toBe("");
    });

    it("renders imageUrl when iconUrl.fileObject exists", () => {
      wrapper = createWrapper({
        organization: createMockOrganization({
          iconUrl: { fileObject: "https://example.com/image.png" },
        }),
      });
      expect(getCardProps(wrapper).imageUrl).toBe(
        "https://example.com/image.png"
      );
    });

    it("renders empty imageUrl when iconUrl is undefined", () => {
      wrapper = createWrapper({ organization: createMockOrganization() });
      expect(getCardProps(wrapper).imageUrl).toBe("");
    });

    it("renders MenuSearchResult with organization prop", () => {
      const org = createMockOrganization({ name: "Test Org" });
      wrapper = createWrapper({ organization: org });
      const menuStub = getMenuStub(wrapper);

      expect(menuStub.exists()).toBe(true);
      expect(menuStub.props("organization")).toEqual(org);
    });
  });

  // MARK: Rendering Location

  describe("Rendering Location", () => {
    it("renders location from first part of addressOrName", () => {
      wrapper = createWrapper({
        organization: createMockOrganization({
          location: { addressOrName: "New York, USA" },
        }),
      });

      expect(wrapper.text()).toContain("New York");
      expect(getMetaTagCount(wrapper)).toBe(2);
    });

    it("does not render MetaTagLocation when location is undefined", () => {
      wrapper = createWrapper({ organization: createMockOrganization() });
      expect(getMetaTagCount(wrapper)).toBe(0);
    });

    it("handles location with multiple commas", () => {
      wrapper = createWrapper({
        organization: createMockOrganization({
          location: {
            addressOrName: "121 Wall St, Suite 67, New York, NY, USA",
          },
        }),
      });
      expect(wrapper.text()).toContain("121 Wall St");
    });
  });

  // MARK: Props & State

  describe("Props & State", () => {
    it("passes isReduced prop when true", () => {
      wrapper = createWrapper({
        organization: createMockOrganization(),
        isReduced: true,
      });
      expect(getCardProps(wrapper).isReduced).toBe(true);
    });

    it("passes isReduced prop when false", () => {
      wrapper = createWrapper({
        organization: createMockOrganization(),
        isReduced: false,
      });
      expect(getCardProps(wrapper).isReduced).toBe(false);
    });

    it("handles complex organization with all properties", () => {
      wrapper = createWrapper({
        organization: createMockOrganization({
          name: "Complex Org",
          orgName: "complex-org",
          texts: [{ description: "Full description" }],
          iconUrl: { fileObject: "https://example.com/icon.png" },
          location: { addressOrName: "London, UK" },
        }),
        isReduced: true,
      });
      const props = getCardProps(wrapper);

      expect(props.title).toBe("Complex Org");
      expect(props.description).toBe("Full description");
      expect(props.imageUrl).toBe("https://example.com/icon.png");
      expect(props.isReduced).toBe(true);
    });
  });

  // MARK: Styling

  describe("Styling", () => {
    it("applies responsive positioning classes to MenuSearchResult", () => {
      wrapper = createWrapper({ organization: createMockOrganization() });
      const menuStub = getMenuStub(wrapper);

      ["max-md:absolute", "max-md:right-0", "max-md:top-0"].forEach((cls) =>
        expect(menuStub.classes()).toContain(cls)
      );
      expect(
        menuStub.classes().filter((c) => c.startsWith("max-md:"))
      ).toHaveLength(3);
    });

    it("applies consistent styling structure across reduced and normal states", () => {
      const wrapperReduced = createWrapper({
        organization: createMockOrganization(),
        isReduced: true,
      });
      const wrapperNormal = createWrapper({
        organization: createMockOrganization(),
        isReduced: false,
      });

      expect(getCardProps(wrapperReduced).isReduced).toBe(true);
      expect(getCardProps(wrapperNormal).isReduced).toBe(false);
      expect(
        wrapperReduced.find(".card-search-result-entity-stub").exists()
      ).toBe(true);
      expect(
        wrapperNormal.find(".card-search-result-entity-stub").exists()
      ).toBe(true);
    });
  });

  // MARK: Accessibility

  describe("Accessibility: ARIA Attributes", () => {
    it("sets correct aria-label and imageAlt", () => {
      wrapper = createWrapper({
        organization: createMockOrganization({ name: "My Organization" }),
      });
      const props = getCardProps(wrapper);

      expect(props.ariaLabel).toBe(
        "Navigate to the page for this organization"
      );
      expect(props.imageAlt).toBe("The organization logo of My Organization.");
      expect(props.iconName).toBe("IconOrganization");
    });

    it("updates imageAlt when organization name changes", async () => {
      wrapper = createWrapper({
        organization: createMockOrganization({ name: "Initial Name" }),
      });

      await wrapper.setProps({
        organization: createMockOrganization({ name: "Updated Name" }),
      });
      await nextTick();

      expect(getCardProps(wrapper).imageAlt).toBe(
        "The organization logo of Updated Name."
      );
    });

    it("maintains consistent aria-label across different organizations", () => {
      const org1 = createMockOrganization({ name: "Org One" });
      const org2 = createMockOrganization({ name: "Org Two" });

      const wrapper1 = createWrapper({ organization: org1 });
      const wrapper2 = createWrapper({ organization: org2 });

      expect(getCardProps(wrapper1).ariaLabel).toBe(
        "Navigate to the page for this organization"
      );
      expect(getCardProps(wrapper2).ariaLabel).toBe(
        "Navigate to the page for this organization"
      );
    });

    it("provides descriptive imageAlt for organizations without icons", () => {
      wrapper = createWrapper({
        organization: createMockOrganization({
          name: "No Icon Org",
          iconUrl: undefined,
        }),
      });

      expect(getCardProps(wrapper).imageAlt).toBe(
        "The organization logo of No Icon Org."
      );
      expect(getCardProps(wrapper).iconName).toBe("IconOrganization");
    });
  });

  // MARK: Handling Update logic

  describe("Updating Logic", () => {
    it("updates description when organization texts change", async () => {
      wrapper = createWrapper({
        organization: createMockOrganization({
          texts: [{ description: "Original" }],
        }),
      });

      await wrapper.setProps({
        organization: createMockOrganization({
          texts: [{ description: "Updated" }],
        }),
      });
      await nextTick();

      expect(getCardProps(wrapper).description).toBe("Updated");
    });

    it("updates imageUrl when iconUrl changes", async () => {
      wrapper = createWrapper({
        organization: createMockOrganization({
          iconUrl: { fileObject: "https://example.com/old.png" },
        }),
      });

      await wrapper.setProps({
        organization: createMockOrganization({
          iconUrl: { fileObject: "https://example.com/new.png" },
        }),
      });
      await nextTick();

      expect(getCardProps(wrapper).imageUrl).toBe(
        "https://example.com/new.png"
      );
    });

    it("handles location changes and removal", async () => {
      wrapper = createWrapper({
        organization: createMockOrganization({
          location: { addressOrName: "Paris, France" },
        }),
      });

      expect(getMetaTagCount(wrapper)).toBe(2);

      await wrapper.setProps({
        organization: createMockOrganization({ location: undefined }),
      });
      await nextTick();

      expect(getMetaTagCount(wrapper)).toBe(0);
    });
  });

  // MARK: Edge Cases

  describe("Edge Cases", () => {
    it("handles empty organization name", () => {
      wrapper = createWrapper({
        organization: createMockOrganization({ name: "" }),
      });
      expect(getCardProps(wrapper).title).toBe("");
    });

    it("handles special characters in name", () => {
      wrapper = createWrapper({
        organization: createMockOrganization({
          name: "Test & Co. <Special> Chars™",
        }),
      });
      expect(getCardProps(wrapper).title).toBe("Test & Co. <Special> Chars™");
    });

    it("uses first description when multiple exist", () => {
      wrapper = createWrapper({
        organization: createMockOrganization({
          texts: [
            { description: "First description" },
            { description: "Second description" },
          ],
        }),
      });
      expect(getCardProps(wrapper).description).toBe("First description");
    });
  });
});
