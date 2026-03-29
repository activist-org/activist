// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ModalOrganizationOverview from "../../../app/components/modal/ModalOrganizationOverview.vue";

// MARK: Stubs

const ModalBaseStub = {
  name: "ModalBase",
  props: ["modalName"],
  template:
    '<div data-testid="modal-base" :data-modal-name="modalName"><slot /></div>',
};

const DialogTitleStub = {
  template: '<div class="dialog-title-stub"><slot /></div>',
};

const MetaTagOrganizationStub = {
  name: "MetaTagOrganization",
  props: ["organization"],
  template: '<div data-testid="meta-tag-org"></div>',
};

// MARK: Test Data

const testEvent = {
  id: "evt-1",
  name: "Climate March",
  createdBy: "user-1",
  type: "action" as const,
  socialLinks: [],
  times: [],
  orgs: [
    {
      id: "org-1",
      name: "Green Org",
      orgName: "green-org",
      tagline: "For the planet",
      location: {},
      socialLinks: [],
      status: 1,
      texts: [],
    },
  ],
  texts: [],
} as unknown as CommunityEvent;

// MARK: Helper

const createWrapper = (props: { event?: CommunityEvent } = {}): VueWrapper =>
  mount(ModalOrganizationOverview, {
    props: { ...props },
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        ModalBase: ModalBaseStub,
        DialogTitle: DialogTitleStub,
        MetaTagOrganization: MetaTagOrganizationStub,
      },
    },
  });

// MARK: Tests

describe("ModalOrganizationOverview component", () => {
  // MARK: Rendering

  describe("Rendering", () => {
    it("renders ModalBase with correct modal name", () => {
      const wrapper = createWrapper({ event: testEvent });
      const modalBase = wrapper.find('[data-testid="modal-base"]');
      expect(modalBase.exists()).toBe(true);
      expect(modalBase.attributes("data-modal-name")).toBe(
        "ModalOrganizationOverview"
      );
    });

    it("renders the organizations heading", () => {
      const wrapper = createWrapper({ event: testEvent });
      expect(wrapper.text()).toContain("i18n._global.organizations");
    });

    it("renders DialogTitle for the heading", () => {
      const wrapper = createWrapper({ event: testEvent });
      const title = wrapper.find(".dialog-title-stub");
      expect(title.exists()).toBe(true);
      expect(title.find("h2").exists()).toBe(true);
    });
  });

  // MARK: Event with Organizations

  describe("Event with Organizations", () => {
    it("renders MetaTagOrganization when event is provided", () => {
      const wrapper = createWrapper({ event: testEvent });
      const metaTag = wrapper.find('[data-testid="meta-tag-org"]');
      expect(metaTag.exists()).toBe(true);
    });

    it("passes event.orgs to MetaTagOrganization", () => {
      const wrapper = createWrapper({ event: testEvent });
      const metaTag = wrapper.findComponent({ name: "MetaTagOrganization" });
      expect(metaTag.props("organization")).toEqual(testEvent.orgs);
    });

    it("renders organization card with card-style class", () => {
      const wrapper = createWrapper({ event: testEvent });
      const card = wrapper.find(".card-style");
      expect(card.exists()).toBe(true);
    });
  });

  // MARK: No Event

  describe("No Event", () => {
    it("does not render MetaTagOrganization when event is undefined", () => {
      const wrapper = createWrapper();
      const metaTag = wrapper.find('[data-testid="meta-tag-org"]');
      expect(metaTag.exists()).toBe(false);
    });
  });
});
