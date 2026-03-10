// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ModalSharePage from "../../../app/components/modal/ModalSharePage.vue";

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

const BtnShareIconStub = {
  name: "BtnShareIcon",
  props: [
    "iconName",
    "iconSize",
    "name",
    "nativeBehaviorOptions",
    "reasonForSuggesting",
    "redirectLink",
    "shareOptions",
    "socialComponent",
    "text",
    "type",
    "urlLink",
    "useNativeBehavior",
    "windowFeatures",
  ],
  template: '<div data-testid="share-btn" :data-text="text"></div>',
};

const ModalQRCodeBtnStub = {
  name: "ModalQRCodeBtn",
  props: [
    "organization",
    "group",
    "event",
    "resource",
    "user",
    "reasonForSuggesting",
    "type",
  ],
  template: '<div data-testid="qr-code-btn"></div>',
};

const IconStub = {
  name: "Icon",
  props: ["name", "size"],
  template: '<span class="icon-stub"></span>',
};

const ToasterStub = {
  name: "Toaster",
  props: ["theme"],
  template: '<div data-testid="toaster"></div>',
};

// MARK: Test Data

const testOrganization = {
  id: "org-1",
  name: "Green Org",
  orgName: "green-org",
  tagline: "Save the planet",
  location: {},
  socialLinks: [],
  status: 1,
  texts: [],
} as unknown as Organization;

const testEvent = {
  id: "evt-1",
  name: "Climate March",
  createdBy: "user-1",
  type: "action" as const,
  socialLinks: [],
  times: [],
  orgs: [],
  texts: [],
} as unknown as CommunityEvent;

const testGroup = {
  id: "grp-1",
  name: "Local Chapter",
  groupName: "local-chapter",
  tagline: "Local action",
  createdBy: "user-1",
  location: {},
  socialLinks: [],
  org: { id: "org-1" },
  texts: [],
} as unknown as Group;

const testResource = {
  id: "res-1",
  name: "Guide",
  createdBy: "user-1",
  description: "A guide",
  url: "https://example.com/guide",
  order: 0,
} as unknown as Resource;

const testUser = {
  id: "usr-1",
  userName: "testuser",
  name: "Test User",
  location: "",
  description: "",
  iconUrl: { id: "", imageUrl: "", createdBy: "" },
  email: "test@example.com",
  socialLinks: [],
} as unknown as UserActivist;

// MARK: Helper

const createWrapper = (
  props: {
    cta?: string;
    organization?: Organization;
    group?: Group;
    event?: CommunityEvent;
    resource?: Resource;
    user?: UserActivist;
  } = {}
): VueWrapper =>
  mount(ModalSharePage, {
    props: {
      cta: "primary",
      ...props,
    },
    global: {
      mocks: {
        $t: (key: string) => key,
        $colorMode: { value: "dark" },
      },
      stubs: {
        ModalBase: ModalBaseStub,
        DialogTitle: DialogTitleStub,
        BtnShareIcon: BtnShareIconStub,
        ModalQRCodeBtn: ModalQRCodeBtnStub,
        Icon: IconStub,
        Toaster: ToasterStub,
      },
    },
  });

// MARK: Tests

describe("ModalSharePage component", () => {
  // MARK: Rendering

  describe("Rendering", () => {
    it("renders ModalBase with correct modal name", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      const modalBase = wrapper.find('[data-testid="modal-base"]');
      expect(modalBase.exists()).toBe(true);
      expect(modalBase.attributes("data-modal-name")).toBe("ModalSharePage");
    });

    it("renders the share heading", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      expect(wrapper.text()).toContain(
        "i18n.components.modal_share_page.header"
      );
    });

    it("renders suggested section heading", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      expect(wrapper.text()).toContain(
        "i18n.components.modal_share_page.suggested"
      );
    });

    it("renders other section heading", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      expect(wrapper.text()).toContain(
        "i18n.components.modal_share_page.other"
      );
    });

    it("renders Toaster component", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      expect(wrapper.find('[data-testid="toaster"]').exists()).toBe(true);
    });
  });

  // MARK: Share Buttons

  describe("Share Buttons", () => {
    it("renders suggested share buttons (Signal, Mastodon, Matrix, Email, Copy Link)", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      const shareBtns = wrapper.findAll('[data-testid="share-btn"]');
      const texts = shareBtns.map((btn) => btn.attributes("data-text"));
      expect(texts).toContain("i18n.components.modal_share_page.signal");
      expect(texts).toContain("i18n.components.modal_share_page.mastodon");
      expect(texts).toContain("i18n.components._global.matrix");
      expect(texts).toContain("Email");
      expect(texts).toContain("i18n.components.modal_share_page.copy_link");
    });

    it("renders other share buttons (Telegram, Instagram, Messenger, Facebook, Twitter)", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      const shareBtns = wrapper.findAll('[data-testid="share-btn"]');
      const texts = shareBtns.map((btn) => btn.attributes("data-text"));
      expect(texts).toContain("i18n.components.modal_share_page.telegram");
      expect(texts).toContain("i18n.components._global.instagram");
      expect(texts).toContain("i18n.components.modal_share_page.messenger");
      expect(texts).toContain("i18n.components.modal_share_page.facebook");
      expect(texts).toContain("i18n.components.modal_share_page.twitter");
    });
  });

  // MARK: QR Code Button

  describe("QR Code Button", () => {
    it("renders QR code button for organization", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      const qrBtns = wrapper.findAll('[data-testid="qr-code-btn"]');
      expect(qrBtns).toHaveLength(1);
    });

    it("renders QR code button for event", () => {
      const wrapper = createWrapper({ event: testEvent });
      const qrBtns = wrapper.findAll('[data-testid="qr-code-btn"]');
      expect(qrBtns).toHaveLength(1);
    });

    it("renders QR code button for group", () => {
      const wrapper = createWrapper({ group: testGroup });
      const qrBtns = wrapper.findAll('[data-testid="qr-code-btn"]');
      expect(qrBtns).toHaveLength(1);
    });

    it("renders QR code button for resource", () => {
      const wrapper = createWrapper({ resource: testResource });
      const qrBtns = wrapper.findAll('[data-testid="qr-code-btn"]');
      expect(qrBtns).toHaveLength(1);
    });

    it("renders QR code button for user", () => {
      const wrapper = createWrapper({ user: testUser });
      const qrBtns = wrapper.findAll('[data-testid="qr-code-btn"]');
      expect(qrBtns).toHaveLength(1);
    });

    it("does not render QR code button when no entity is provided", () => {
      const wrapper = createWrapper();
      const qrBtns = wrapper.findAll('[data-testid="qr-code-btn"]');
      expect(qrBtns).toHaveLength(0);
    });

    it("passes organization to QR code button", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      const qrBtn = wrapper.findComponent({ name: "ModalQRCodeBtn" });
      expect(qrBtn.props("organization")).toEqual(testOrganization);
    });

    it("passes event to QR code button", () => {
      const wrapper = createWrapper({ event: testEvent });
      const qrBtn = wrapper.findComponent({ name: "ModalQRCodeBtn" });
      expect(qrBtn.props("event")).toEqual(testEvent);
    });

    it("passes group to QR code button", () => {
      const wrapper = createWrapper({ group: testGroup });
      const qrBtn = wrapper.findComponent({ name: "ModalQRCodeBtn" });
      expect(qrBtn.props("group")).toEqual(testGroup);
    });

    it("passes resource to QR code button", () => {
      const wrapper = createWrapper({ resource: testResource });
      const qrBtn = wrapper.findComponent({ name: "ModalQRCodeBtn" });
      expect(qrBtn.props("resource")).toEqual(testResource);
    });

    it("passes user to QR code button", () => {
      const wrapper = createWrapper({ user: testUser });
      const qrBtn = wrapper.findComponent({ name: "ModalQRCodeBtn" });
      expect(qrBtn.props("user")).toEqual(testUser);
    });
  });

  // MARK: URL Generation

  describe("URL Generation", () => {
    it("generates organization URL", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      const vm = wrapper.vm as unknown as { getCurrentUrl: () => string };
      expect(vm.getCurrentUrl()).toContain("/organizations/org-1");
    });

    it("generates event URL", () => {
      const wrapper = createWrapper({ event: testEvent });
      const vm = wrapper.vm as unknown as { getCurrentUrl: () => string };
      expect(vm.getCurrentUrl()).toContain("/events/evt-1");
    });

    it("generates group URL with org prefix", () => {
      const wrapper = createWrapper({ group: testGroup });
      const vm = wrapper.vm as unknown as { getCurrentUrl: () => string };
      const url = vm.getCurrentUrl();
      expect(url).toContain("/organizations/org-1/groups/grp-1");
    });

    it("returns resource URL directly", () => {
      const wrapper = createWrapper({ resource: testResource });
      const vm = wrapper.vm as unknown as { getCurrentUrl: () => string };
      expect(vm.getCurrentUrl()).toBe("https://example.com/guide");
    });

    it("generates user URL", () => {
      const wrapper = createWrapper({ user: testUser });
      const vm = wrapper.vm as unknown as { getCurrentUrl: () => string };
      expect(vm.getCurrentUrl()).toContain("/users/usr-1");
    });

    it("falls back to window.location when no entity is provided", () => {
      const wrapper = createWrapper();
      const vm = wrapper.vm as unknown as { getCurrentUrl: () => string };
      const url = vm.getCurrentUrl();
      expect(typeof url).toBe("string");
      expect(url.length).toBeGreaterThan(0);
    });
  });

  // MARK: Name Resolution

  describe("Name Resolution", () => {
    it("returns event name when event is provided", () => {
      const wrapper = createWrapper({ event: testEvent });
      const vm = wrapper.vm as unknown as { getCurrentName: () => string };
      expect(vm.getCurrentName()).toBe("Climate March");
    });

    it("returns organization name when only organization is provided", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      const vm = wrapper.vm as unknown as { getCurrentName: () => string };
      expect(vm.getCurrentName()).toBe("Green Org");
    });

    it("returns empty string when no entity with name is provided", () => {
      const wrapper = createWrapper();
      const vm = wrapper.vm as unknown as { getCurrentName: () => string };
      expect(vm.getCurrentName()).toBe("");
    });
  });

  // MARK: Layout

  describe("Layout", () => {
    it("renders grid layout for suggested buttons", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      const grid = wrapper.find(".grid.grid-cols-3.grid-rows-2");
      expect(grid.exists()).toBe(true);
    });

    it("renders grid layout for other buttons", () => {
      const wrapper = createWrapper({ organization: testOrganization });
      const grids = wrapper.findAll(".grid.grid-cols-3");
      expect(grids.length).toBeGreaterThanOrEqual(2);
    });
  });
});
