// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ModalMediaImageCarousel from "../../../app/components/modal/ModalMediaImageCarousel.vue";
import { EntityType } from "../../../shared/types/entity";

// MARK: Stubs

const ModalBaseStub = {
  name: "ModalBase",
  props: ["modalName"],
  template: '<div data-testid="modal-base" :data-modal-name="modalName"><slot /></div>',
};

const MediaImageCarouselStub = {
  name: "MediaImageCarousel",
  props: ["entityType", "fullscreen", "imageUrls"],
  template:
    '<div data-testid="media-carousel" :data-entity-type="entityType" :data-fullscreen="fullscreen"></div>',
};

// MARK: Helper

const createWrapper = (
  props: { imageUrls?: string[]; entityType?: EntityType } = {}
): VueWrapper =>
  mount(ModalMediaImageCarousel, {
    props: {
      imageUrls: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
      entityType: EntityType.ORGANIZATION,
      ...props,
    },
    global: {
      stubs: {
        ModalBase: ModalBaseStub,
        MediaImageCarousel: MediaImageCarouselStub,
      },
    },
  });

// MARK: Tests

describe("ModalMediaImageCarousel component", () => {
  // MARK: Rendering

  describe("Rendering", () => {
    it("renders ModalBase with correct modal name", () => {
      const wrapper = createWrapper();
      const modalBase = wrapper.find('[data-testid="modal-base"]');
      expect(modalBase.exists()).toBe(true);
      expect(modalBase.attributes("data-modal-name")).toBe("ModalMediaImage");
    });

    it("renders MediaImageCarousel inside ModalBase", () => {
      const wrapper = createWrapper();
      const carousel = wrapper.find('[data-testid="media-carousel"]');
      expect(carousel.exists()).toBe(true);
    });
  });

  // MARK: Props Forwarding

  describe("Props Forwarding", () => {
    it("passes entityType to MediaImageCarousel", () => {
      const wrapper = createWrapper({ entityType: EntityType.EVENT });
      const carousel = wrapper.findComponent({ name: "MediaImageCarousel" });
      expect(carousel.props("entityType")).toBe(EntityType.EVENT);
    });

    it("passes imageUrls to MediaImageCarousel", () => {
      const urls = ["https://example.com/a.jpg", "https://example.com/b.jpg"];
      const wrapper = createWrapper({ imageUrls: urls });
      const carousel = wrapper.findComponent({ name: "MediaImageCarousel" });
      expect(carousel.props("imageUrls")).toEqual(urls);
    });

    it("sets fullscreen to true on MediaImageCarousel", () => {
      const wrapper = createWrapper();
      const carousel = wrapper.findComponent({ name: "MediaImageCarousel" });
      expect(carousel.props("fullscreen")).toBe(true);
    });

    it("defaults imageUrls to empty array when prop is undefined", () => {
      const wrapper = mount(ModalMediaImageCarousel, {
        props: {
          imageUrls: undefined as unknown as string[],
          entityType: EntityType.ORGANIZATION,
        },
        global: {
          stubs: {
            ModalBase: ModalBaseStub,
            MediaImageCarousel: MediaImageCarouselStub,
          },
        },
      });
      const carousel = wrapper.findComponent({ name: "MediaImageCarousel" });
      expect(carousel.props("imageUrls")).toEqual([]);
    });
  });
});
