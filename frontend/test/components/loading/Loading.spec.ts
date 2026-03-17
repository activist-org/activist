// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";

import Loading from "../../../app/components/Loading.vue";

const ACTIVIST_ICON_LIGHT_URL = "/icons/activist/activist_icon_light.png";
const ACTIVIST_ICON_DARK_URL = "/icons/activist/activist_icon_dark.png";

const createWrapper = (colorMode = "light", loading = true) =>
  mount(Loading, {
    props: { loading },
    global: {
      mocks: {
        $colorMode: { value: colorMode },
        $t: (key: string) => key,
      },
      stubs: { Transition: false },
    },
  });

describe("Loading Component", () => {
  let wrapper: ReturnType<typeof mount>;

  afterEach(() => {
    wrapper?.unmount();
  });

  // MARK: Rendering

  describe("Rendering", () => {
    it("renders the component", () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it("renders the inner loading-pulse div", () => {
      wrapper = createWrapper();
      expect(wrapper.find(".loading-pulse").exists()).toBe(true);
    });

    it("renders exactly one img when loading and color mode is light", () => {
      wrapper = createWrapper("light", true);
      expect(wrapper.findAll("img")).toHaveLength(1);
    });

    it("renders exactly one img when loading and color mode is dark", () => {
      wrapper = createWrapper("dark", true);
      expect(wrapper.findAll("img")).toHaveLength(1);
    });

    it("renders no visible content when loading is false", () => {
      wrapper = createWrapper("light", false);
      const container = wrapper.find(".flex.items-center.justify-center");
      expect(container.attributes("style")).toContain("display: none");
    });
  });

  // MARK: Color Mode

  describe("Color mode icon switching", () => {
    it("renders the light icon in light mode", () => {
      wrapper = createWrapper("light", true);
      expect(wrapper.find("img").attributes("src")).toBe(ACTIVIST_ICON_LIGHT_URL);
    });

    it("renders the dark icon in dark mode", () => {
      wrapper = createWrapper("dark", true);
      expect(wrapper.find("img").attributes("src")).toBe(ACTIVIST_ICON_DARK_URL);
    });

    it("does not render the dark icon in light mode", () => {
      wrapper = createWrapper("light", true);
      const srcs = wrapper.findAll("img").map((i) => i.attributes("src"));
      expect(srcs).not.toContain(ACTIVIST_ICON_DARK_URL);
    });

    it("does not render the light icon in dark mode", () => {
      wrapper = createWrapper("dark", true);
      const srcs = wrapper.findAll("img").map((i) => i.attributes("src"));
      expect(srcs).not.toContain(ACTIVIST_ICON_LIGHT_URL);
    });
  });

  // MARK: Accessibility

  describe("Accessibility", () => {
    it("img has a non-empty alt attribute in light mode", () => {
      wrapper = createWrapper("light", true);
      expect(wrapper.find("img").attributes("alt")).toBeTruthy();
    });

    it("img has a non-empty alt attribute in dark mode", () => {
      wrapper = createWrapper("dark", true);
      expect(wrapper.find("img").attributes("alt")).toBeTruthy();
    });

    it("img alt text comes from i18n key", () => {
      wrapper = createWrapper("light", true);
      expect(wrapper.find("img").attributes("alt")).toBe(
        "i18n._global.activist_icon_img_alt_text"
      );
    });
  });

  // MARK: Props

  describe("Props", () => {
    it("hides content by default when loading prop is not passed", () => {
      wrapper = mount(Loading, {
        global: {
          mocks: { $colorMode: { value: "light" }, $t: (k: string) => k },
        },
      });
      const container = wrapper.find(".flex.items-center.justify-center");
      expect(container.attributes("style")).toContain("display: none");
    });

    it("shows content when loading prop is toggled to true", async () => {
      wrapper = createWrapper("light", false);
      await wrapper.setProps({ loading: true });
      await wrapper.vm.$nextTick();
      const style = wrapper.find(".flex.items-center.justify-center").attributes("style") ?? "";
      expect(style).not.toContain("display: none");
    });

    it("hides content when loading prop is toggled to false", async () => {
      wrapper = createWrapper("light", true);
      await wrapper.setProps({ loading: false });
      await wrapper.vm.$nextTick();
      expect(wrapper.find(".flex.items-center.justify-center").attributes("style")).toContain("display: none");
    });
  });

  // MARK: Styling

  describe("Styling", () => {
    it("outer container has flex centering classes", () => {
      wrapper = createWrapper();
      expect(wrapper.find(".flex.items-center.justify-center").exists()).toBe(true);
    });

    it("inner div has loading-pulse class", () => {
      wrapper = createWrapper();
      expect(wrapper.find(".loading-pulse").exists()).toBe(true);
    });

    it("img has h-40 size class", () => {
      wrapper = createWrapper("light", true);
      expect(wrapper.find("img").classes()).toContain("h-40");
    });
  });
});