// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CardSearchResultEntityUser from "../../../app/components/card/search-result-entity/CardSearchResultEntityUser.vue";

// MARK: Helper

interface UserEntity {
  id: string;
  name: string;
  description?: string;
  location?: string;
  iconUrl?: {
    fileObject?: string;
  };
}

const defaultEntity: UserEntity = {
  id: "user-1",
  name: "Sample User",
  description: "Sample user description",
  location: "Qatar",
};

vi.mock("#app", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: { value: "en" },
  }),
}));

vi.mock("~/composables/useLinkURL", () => ({
  useLinkURL: () => ({
    linkUrl: { value: "/users/user-1/about" },
  }),
}));

const createWrapper = (
  entityOverrides: Partial<UserEntity> = {},
  componentProps: { isReduced?: boolean; isPrivate?: boolean } = {}
) =>
  mount(CardSearchResultEntityUser, {
    props: {
      user: { ...defaultEntity, ...entityOverrides },
      ...componentProps,
    },
    global: {
      mocks: {
        $t: (key: string) => key,
      },
      stubs: {
        Icon: { template: '<span class="icon-stub"></span>' },
        CardSearchResultEntity: {
          template: `
            <div data-testid="card-search-result">
              <slot name="menu" />
              <slot name="desktop-meta-tags" />
              <slot name="mobile-meta-tags" />
            </div>
          `,
        },
        MenuSearchResult: { template: '<div class="menu-stub"></div>' },
        MetaTagLocation: { template: '<div class="location-stub"><slot /></div>' },
      },
    },
  });

// MARK: Tests

describe("CardSearchResultEntityUser", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // MARK: Rendering

  describe("Rendering", () => {
    it("renders user component", () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it("passes user name to title prop", () => {
      wrapper = createWrapper({ name: "John Doe" });
      expect(wrapper.html()).toContain("John Doe");
    });

    it("renders description when provided", () => {
      wrapper = createWrapper({ description: "Test description" });
      expect(wrapper.html()).toContain("Test description");
    });

    it("handles missing description", () => {
      wrapper = createWrapper({ description: undefined });
      expect(wrapper.exists()).toBe(true);
    });

    it("renders location when provided", () => {
      wrapper = createWrapper({ location: "Doha" });
      const location = wrapper.find(".location-stub");
      expect(location.exists()).toBe(true);
    });

    it("does not render location when missing", () => {
      wrapper = createWrapper({ location: undefined });
      const location = wrapper.find(".location-stub");
      expect(location.exists()).toBe(false);
    });

    it("renders safely with minimal data", () => {
      wrapper = createWrapper({
        id: "",
        name: "",
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  // MARK: Accessibility

  describe("Accessibility", () => {
    it("has aria label for navigation", () => {
      wrapper = createWrapper();
      expect(wrapper.html()).toContain("aria");
    });

    it("passes correct image alt text", () => {
      wrapper = createWrapper({ name: "Jane Smith" });
      expect(wrapper.html()).toContain("imagealt");
    });
  });

  // MARK: Styling

  describe("Styling", () => {
    it("component renders when isReduced is false", () => {
      wrapper = createWrapper({}, { isReduced: false });
      expect(wrapper.exists()).toBe(true);
    });

    it("component renders when isReduced is true", () => {
      wrapper = createWrapper({}, { isReduced: true });
      expect(wrapper.exists()).toBe(true);
    });
  });

  // MARK: User Icon

  describe("User Icon", () => {
    it("uses default icon when no iconUrl provided", () => {
      wrapper = createWrapper({ iconUrl: undefined });
      expect(wrapper.html()).toContain("iconname");
    });

    it("uses user iconUrl when provided", () => {
      wrapper = createWrapper({
        iconUrl: { fileObject: "/path/to/icon.jpg" },
      });
      expect(wrapper.html()).toContain("/path/to/icon.jpg");
    });
  });

  // MARK: Edge Cases

  describe("Edge Cases", () => {
    it("handles undefined location gracefully", () => {
      wrapper = createWrapper({ location: undefined });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles empty description", () => {
      wrapper = createWrapper({ description: "" });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles missing iconUrl object", () => {
      wrapper = createWrapper({ iconUrl: undefined });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles empty iconUrl fileObject", () => {
      wrapper = createWrapper({ iconUrl: { fileObject: "" } });
      expect(wrapper.exists()).toBe(true);
    });

    it("renders with all optional fields missing", () => {
      wrapper = createWrapper({
        id: "user-1",
        name: "User",
        description: undefined,
        location: undefined,
        iconUrl: undefined,
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles special characters in user name", () => {
      wrapper = createWrapper({ name: "User @#$% Test" });
      expect(wrapper.html()).toContain("User @#$% Test");
    });

    it("handles very long user name", () => {
      const longName = "A".repeat(200);
      wrapper = createWrapper({ name: longName });
      expect(wrapper.html()).toContain(longName);
    });

    it("handles very long description", () => {
      const longDescription = "This is a very long description. ".repeat(50);
      wrapper = createWrapper({ description: longDescription });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles location with special characters", () => {
      wrapper = createWrapper({ location: "São Paulo, Brazil" });
      const location = wrapper.find(".location-stub");
      expect(location.exists()).toBe(true);
    });

    it("handles both isReduced and isPrivate props together", () => {
      wrapper = createWrapper({}, { isReduced: true, isPrivate: true });
      expect(wrapper.exists()).toBe(true);
    });
  });
});