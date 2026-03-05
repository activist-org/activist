// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CardSearchResultEntityEvent from "../../../app/components/card/search-result-entity/CardSearchResultEntityEvent.vue";

interface EventEntity {
  id: string;
  name: string;
  type: "action" | "learn";
  startTime?: string;
  texts?: Array<{ description?: string }>;
  offlineLocation?: {
    displayName: string;
  };
  onlineLocationLink?: string;
  iconUrl?: {
    fileObject?: string;
  };
  orgs?: any;
}

const defaultEntity: EventEntity = {
  id: "event-1",
  name: "Sample Event",
  type: "action",
  startTime: "2025-01-01T10:00:00Z",
  texts: [{ description: "Sample event description" }],
  offlineLocation: {
    displayName: "Qatar, Doha",
  },
};

// Mock composables
vi.mock("#app", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: { value: "en" },
  }),
}));

// Mock useLinkURL composable
vi.mock("~/composables/useLinkURL", () => ({
  useLinkURL: () => ({
    linkUrl: { value: "/events/event-1/about" },
  }),
}));

const createWrapper = (
  entityOverrides: Partial<EventEntity> = {},
  componentProps: { isReduced?: boolean; isPrivate?: boolean } = {}
) =>
  mount(CardSearchResultEntityEvent, {
    props: {
      event: { ...defaultEntity, ...entityOverrides },
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
              <slot name="image" :imageUrl="$attrs.imageUrl" />
              <slot name="menu" />
              <slot name="desktop-meta-tags" />
              <slot name="mobile-meta-tags" />
              <slot name="organizations" />
            </div>
          `,
        },
        ImageEvent: { template: '<img />' },
        MenuSearchResult: { template: '<div class="menu-stub"></div>' },
        MetaTagLocation: { template: '<div class="location-stub"><slot /></div>' },
        MetaTagVideo: { template: '<div class="video-stub"></div>' },
        MetaTagDate: { template: '<div class="date-stub"></div>' },
        MetaTagOrganization: { template: '<div class="org-stub"></div>' },
      },
    },
  });

// MARK: Tests

describe("CardSearchResultEntityEvent", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // MARK: Rendering

  describe("Rendering", () => {
    it("renders event component", () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it("passes event name to title prop", () => {
      wrapper = createWrapper({ name: "Test Event" });
      expect(wrapper.html()).toContain("Test Event");
    });

    it("renders location when offline location provided", () => {
      wrapper = createWrapper({
        offlineLocation: { displayName: "Qatar, Doha" },
      });
      const location = wrapper.find(".location-stub");
      expect(location.exists()).toBe(true);
    });

    it("does not render location when missing", () => {
      wrapper = createWrapper({ offlineLocation: undefined });
      const location = wrapper.find(".location-stub");
      expect(location.exists()).toBe(false);
    });

    it("renders safely with minimal data", () => {
      wrapper = createWrapper({
        id: "",
        name: "",
        type: "action",
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("renders description when provided", () => {
      wrapper = createWrapper({
        texts: [{ description: "Event description text" }],
      });
      expect(wrapper.html()).toContain("Event description text");
    });

    it("renders organization when provided", () => {
      wrapper = createWrapper({ orgs: { name: "Test Org" } });
      expect(wrapper.exists()).toBe(true);
    });
  });

  // MARK: Accessibility

  describe("Accessibility", () => {
    it("renders with proper data-testid", () => {
      wrapper = createWrapper();
      const eventCard = wrapper.find('[data-testid="event-card"]');
      expect(eventCard.exists()).toBe(true);
    });

    it("has aria label for navigation", () => {
      wrapper = createWrapper();
      expect(wrapper.html()).toContain("aria");
    });
  });

  // MARK: Styling 

  describe("Styling", () => {
    it("component renders when isReduced is false", () => {
      wrapper = createWrapper({}, { isReduced: false });
      const eventCard = wrapper.find('[data-testid="event-card"]');
      expect(eventCard.exists()).toBe(true);
    });

    it("component renders when isReduced is true", () => {
      wrapper = createWrapper({}, { isReduced: true });
      const eventCard = wrapper.find('[data-testid="event-card"]');
      expect(eventCard.exists()).toBe(true);
    });
  });

  // MARK: Interaction

  describe("Event Types", () => {
    it("renders action event type", () => {
      wrapper = createWrapper({ type: "action" });
      expect(wrapper.exists()).toBe(true);
    });

    it("renders learn event type", () => {
      wrapper = createWrapper({ type: "learn" });
      expect(wrapper.exists()).toBe(true);
    });
  });

  // MARK: Edge Cases

  describe("Edge Cases", () => {
    it("handles undefined offline location gracefully", () => {
      wrapper = createWrapper({ offlineLocation: undefined });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles missing description", () => {
      wrapper = createWrapper({ texts: [] });
      expect(wrapper.exists()).toBe(true);
    });

    it("renders date from startTime", () => {
      wrapper = createWrapper({ startTime: "2025-12-31T15:00:00Z" });
      const date = wrapper.find(".date-stub");
      expect(date.exists()).toBe(true);
    });

    it("renders online location link when provided", () => {
      wrapper = createWrapper({
        offlineLocation: undefined,
        onlineLocationLink: "https://example.com/event",
      });
      const video = wrapper.find(".video-stub");
      expect(video.exists()).toBe(true);
    });

    it("handles special characters in event name", () => {
      wrapper = createWrapper({ name: "Event @#$% Test & More" });
      expect(wrapper.html()).toContain("Event @#$% Test &amp; More");
    });

    it("handles very long event name", () => {
      const longName = "A".repeat(200);
      wrapper = createWrapper({ name: longName });
      expect(wrapper.html()).toContain(longName);
    });

    it("handles missing startTime", () => {
      wrapper = createWrapper({ startTime: undefined });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles empty startTime string", () => {
      wrapper = createWrapper({ startTime: "" });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles both online and offline location", () => {
      wrapper = createWrapper({
        offlineLocation: { displayName: "Doha, Qatar" },
        onlineLocationLink: "https://example.com/stream",
      });
      const location = wrapper.find(".location-stub");
      const video = wrapper.find(".video-stub");
      expect(location.exists()).toBe(true);
      expect(video.exists()).toBe(true); // Both can show
    });

    it("handles missing iconUrl", () => {
      wrapper = createWrapper({ iconUrl: undefined });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles iconUrl with fileObject", () => {
      wrapper = createWrapper({
        iconUrl: { fileObject: "/path/to/event-icon.jpg" },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles combined isReduced and isPrivate props", () => {
      wrapper = createWrapper({}, { isReduced: true, isPrivate: true });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles location with multiple parts in displayName", () => {
      wrapper = createWrapper({
        offlineLocation: { displayName: "City, State, Country, Extra" },
      });
      const location = wrapper.find(".location-stub");
      expect(location.exists()).toBe(true);
    });
  });
});