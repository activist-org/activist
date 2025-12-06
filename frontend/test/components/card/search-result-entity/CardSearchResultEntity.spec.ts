// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CardSearchResultEntity from "../../../app/components/card/search-result-entity/CardSearchResultEntity.vue";

// MARK: Helper

interface EntityProps {
  title: string;
  description: string;
  linkUrl: string;
  ariaLabel: string;
  imageUrl?: string;
  imageAlt?: string;
  iconName?: string;
  entityName?: string;
  isReduced?: boolean;
}

const defaultProps: EntityProps = {
  title: "Test Entity",
  description: "This is a test entity description",
  linkUrl: "/test-entity",
  ariaLabel: "Navigate to test entity",
  imageUrl: "/images/test.jpg",
  imageAlt: "Test image",
};

// Mock composables
vi.mock("#app", () => ({
  useLocalePath: () => (path: string) => path,
}));

// Mock useBreakpoint
vi.mock("~/composables/useBreakpoint", () => ({
  useBreakpoint: () => ({ value: true }),
}));

const createWrapper = (propsOverrides: Partial<EntityProps> = {}, slots = {}) =>
  mount(CardSearchResultEntity, {
    props: {
      ...defaultProps,
      ...propsOverrides,
    },
    slots,
    global: {
      mocks: {
        $t: (key: string) => key,
      },
      stubs: {
        NuxtLink: {
          template:
            '<a :aria-label="$attrs.ariaLabel" :to="$attrs.to"><slot /></a>',
        },
        Icon: { template: '<span class="icon-stub"></span>' },
      },
    },
  });

// MARK: Tests

describe("CardSearchResultEntity", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // MARK: Rendering

  describe("Rendering", () => {
    it("renders component", () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it("renders title correctly", () => {
      wrapper = createWrapper({ title: "Custom Title" });
      const title = wrapper.find('[data-testid="group-title"]');
      expect(title.text()).toBe("Custom Title");
    });

    it("renders description correctly", () => {
      wrapper = createWrapper({ description: "Custom description" });
      const description = wrapper.find('[data-testid="entity-description"]');
      expect(description.text()).toBe("Custom description");
    });

    it("renders image when imageUrl is provided", () => {
      wrapper = createWrapper({ imageUrl: "/test-image.jpg" });
      const img = wrapper.find("img");
      expect(img.exists()).toBe(true);
      expect(img.attributes("src")).toBe("/test-image.jpg");
    });

    it("renders icon when no imageUrl provided", () => {
      wrapper = createWrapper({ imageUrl: undefined, iconName: "test-icon" });
      const icon = wrapper.find(".icon-stub");
      expect(icon.exists()).toBe(true);
    });

    it("renders entity name when provided", () => {
      wrapper = createWrapper({ entityName: "test_entity" });
      const entityName = wrapper.find('[data-testid="group-entity-name"]');
      expect(entityName.exists()).toBe(true);
      expect(entityName.text()).toContain("@test_entity");
    });

    it("does not render entity name when not provided", () => {
      wrapper = createWrapper({ entityName: undefined });
      const entityName = wrapper.find('[data-testid="group-entity-name"]');
      expect(entityName.exists()).toBe(false);
    });

    it("renders image alt text correctly", () => {
      wrapper = createWrapper({
        imageUrl: "/test.jpg",
        imageAlt: "Custom alt text",
      });
      const img = wrapper.find("img");
      expect(img.attributes("alt")).toBe("Custom alt text");
    });
  });

  // MARK: Accessibility

  describe("Accessibility: ARIA Attributes", () => {
    it("has aria-label on links", () => {
      wrapper = createWrapper({ ariaLabel: "Custom aria label" });
      const links = wrapper.findAll("a");
      links.forEach((link) => {
        expect(link.attributes("aria-label")).toBeDefined();
      });
    });

    it("has proper data-testid attributes", () => {
      wrapper = createWrapper({ entityName: "test" });
      expect(wrapper.find('[data-testid="group-title"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="entity-description"]').exists()).toBe(
        true
      );
      expect(wrapper.find('[data-testid="group-entity-name"]').exists()).toBe(
        true
      );
    });
  });

  // MARK: Styling

  describe("Styling Logic", () => {
    it("applies reduced size classes when isReduced is true", () => {
      wrapper = createWrapper({ isReduced: true, imageUrl: "/test.jpg" });
      const img = wrapper.find("img");
      expect(img.classes()).toContain("h-[150px]");
      expect(img.classes()).toContain("w-[150px]");
    });

    it("applies normal size classes when isReduced is false", () => {
      wrapper = createWrapper({ isReduced: false, imageUrl: "/test.jpg" });
      const img = wrapper.find("img");
      expect(img.classes()).toContain("h-[200px]");
      expect(img.classes()).toContain("w-[200px]");
    });

    it("applies line-clamp classes to description when isReduced", () => {
      wrapper = createWrapper({ isReduced: true });
      const description = wrapper.find('[data-testid="entity-description"]');
      expect(description.classes()).toContain("line-clamp-3");
    });

    it("applies different line-clamp classes when not reduced", () => {
      wrapper = createWrapper({ isReduced: false });
      const description = wrapper.find('[data-testid="entity-description"]');
      expect(description.classes()).toContain("line-clamp-4");
    });

    it("has card-style base class", () => {
      wrapper = createWrapper();
      const card = wrapper.find(".card-style");
      expect(card.exists()).toBe(true);
    });
  });

  // MARK: Slots Content
  describe("Slots", () => {
    it("renders menu slot content", () => {
      wrapper = createWrapper(
        {},
        { menu: '<div class="test-menu">Menu Content</div>' }
      );
      expect(wrapper.html()).toContain("test-menu");
    });

    it("renders desktop-meta-tags slot content", () => {
      wrapper = createWrapper(
        {},
        { "desktop-meta-tags": '<div class="test-tags">Tags</div>' }
      );
      expect(wrapper.html()).toContain("test-tags");
    });

    it("renders organizations slot content", () => {
      wrapper = createWrapper(
        {},
        { organizations: '<div class="test-orgs">Organizations</div>' }
      );
      expect(wrapper.html()).toContain("test-orgs");
    });

    it("renders custom image slot content", () => {
      wrapper = createWrapper(
        {},
        {
          image: '<div class="custom-image">Custom Image</div>',
        }
      );
      expect(wrapper.html()).toContain("custom-image");
    });
  });

  // MARK: Edge Cases

  describe("Edge Cases", () => {
    it("handles empty title", () => {
      wrapper = createWrapper({ title: "" });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles empty description", () => {
      wrapper = createWrapper({ description: "" });
      const description = wrapper.find('[data-testid="entity-description"]');
      expect(description.text()).toBe("");
    });

    it("handles very long title", () => {
      const longTitle = "A".repeat(200);
      wrapper = createWrapper({ title: longTitle });
      const title = wrapper.find('[data-testid="group-title"]');
      expect(title.text()).toBe(longTitle);
    });

    it("handles very long description", () => {
      const longDesc = "This is a very long description. ".repeat(50);
      wrapper = createWrapper({ description: longDesc });
      const description = wrapper.find('[data-testid="entity-description"]');
      expect(description.text()).toContain("This is a very long description.");
    });

    it("handles special characters in title", () => {
      wrapper = createWrapper({ title: "Title @#$% & More" });
      const title = wrapper.find('[data-testid="group-title"]');
      expect(title.text()).toContain("Title @#$% & More");
    });

    it("handles undefined imageUrl and iconName", () => {
      wrapper = createWrapper({ imageUrl: undefined, iconName: undefined });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles empty linkUrl", () => {
      wrapper = createWrapper({ linkUrl: "" });
      const links = wrapper.findAll("a");
      expect(links.length).toBeGreaterThan(0);
    });

    it("handles missing imageAlt when image provided", () => {
      wrapper = createWrapper({ imageUrl: "/test.jpg", imageAlt: undefined });
      const img = wrapper.find("img");
      expect(img.exists()).toBe(true);
    });

    it("renders with all optional props missing", () => {
      wrapper = createWrapper({
        imageUrl: undefined,
        imageAlt: undefined,
        iconName: undefined,
        entityName: undefined,
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles entity name with special characters", () => {
      wrapper = createWrapper({ entityName: "test_entity-123" });
      const entityName = wrapper.find('[data-testid="group-entity-name"]');
      expect(entityName.text()).toContain("@test_entity-123");
    });
  });
});
