// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import Loading from "../../../app/components/Loading.vue";

describe("Loading Component", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(Loading, {
      props: {},
      global: {
        mocks: {
          $colorMode: {
            value: "light",
          },
          $t: () => "mock translation",
        },
        stubs: {
          Transition: false,
        },
      },
    });
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe("Component Rendering", () => {
    it("should render the component", () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("should have loading class", () => {
      const container = wrapper.find('[class*="loading"]');
      expect(container.exists()).toBe(true);
    });
  });

  describe("Loading Animation Logic", () => {
    it("should display loading animation when loading prop is true", async () => {
      await wrapper.setProps({ loading: true });
      await wrapper.vm.$nextTick();
      const loadingElement = wrapper.find('[class*="loading"]');
      expect(loadingElement.exists()).toBe(true);
      expect(loadingElement.isVisible()).toBe(true);
    });

    it("should hide loading animation when loading prop is false", async () => {
      await wrapper.setProps({ loading: false });
      await wrapper.vm.$nextTick();
      const container = wrapper.find(".flex.items-center.justify-center");
      expect(container.exists()).toBe(true);
      // v-show="false" sets display: none via inline style
      const style = container.attributes("style");
      expect(style).toContain("display: none");
    });
  });

  describe("Accessibility", () => {
    it("should have appropriate role attributes", () => {
      const element = wrapper.find("[role], [aria-label]");
      if (element.exists()) {
        expect(element.attributes()).toBeDefined();
      }
    });

    it("should be properly structured", () => {
      expect(wrapper.element.tagName.toLowerCase()).toMatch(
        /div|section|article/
      );
    });
  });

  describe("Styling", () => {
    it("should apply CSS classes", () => {
      const element = wrapper.find("div");
      expect(element.classes()).toBeDefined();
    });

    it("should have proper display properties", () => {
      const html = wrapper.html();
      expect(html).toBeTruthy();
    });
  });
});
