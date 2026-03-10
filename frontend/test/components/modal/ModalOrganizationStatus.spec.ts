// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import ModalOrganizationStatus from "../../../app/components/modal/ModalOrganizationStatus.vue";
import { useModals } from "../../../app/stores/modals";

// MARK: Stubs

const ModalBaseStub = {
  name: "ModalBase",
  props: ["modalName", "isOpen"],
  emits: ["closeModal"],
  template:
    '<div data-testid="modal-base" :data-modal-name="modalName" :data-is-open="isOpen"><slot /></div>',
};

const DialogTitleStub = {
  template: '<div class="dialog-title-stub"><slot /></div>',
};

const CardOrgApplicationVoteStub = {
  name: "CardOrgApplicationVote",
  props: ["downVotes", "isVotingDisabled", "organizations", "title", "upVotes"],
  template: '<div data-testid="vote-card"></div>',
};

const DiscussionStub = {
  name: "Discussion",
  props: ["discussionEntries", "organization"],
  template: '<div data-testid="discussion"></div>',
};

// MARK: Test Data

const testOrganization = {
  id: "org-1",
  name: "Test Org",
  orgName: "test-org",
  tagline: "Testing",
  location: {},
  socialLinks: [],
  status: 1,
  texts: [],
} as unknown as Organization;

const testModalData = {
  discussionEntries: [
    { id: 1, author: "Alice", content: "Looks good", votes: 3, date: new Date() },
  ],
  organizationsInFavor: [testOrganization],
  upVotes: 5,
  downVotes: 2,
};

// MARK: Helper

const createWrapper = (
  props: { organization?: Organization; isOpen?: boolean } = {},
  provideData = testModalData
): VueWrapper =>
  mount(ModalOrganizationStatus, {
    props: {
      organization: testOrganization,
      isOpen: false,
      ...props,
    },
    global: {
      plugins: [createPinia()],
      mocks: { $t: (key: string, params?: Record<string, string>) => {
        if (params) {
          return Object.entries(params).reduce(
            (str, [k, v]) => str.replace(`{${k}}`, v),
            key
          );
        }
        return key;
      }},
      stubs: {
        ModalBase: ModalBaseStub,
        DialogTitle: DialogTitleStub,
        CardOrgApplicationVote: CardOrgApplicationVoteStub,
        Discussion: DiscussionStub,
      },
      provide: {
        modalOrganizationStatusData: provideData,
      },
    },
  });

// MARK: Tests

describe("ModalOrganizationStatus component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setActivePinia(createPinia());
  });

  // MARK: Rendering

  describe("Rendering", () => {
    it("renders ModalBase with correct modal name", () => {
      const wrapper = createWrapper();
      const modalBase = wrapper.find('[data-testid="modal-base"]');
      expect(modalBase.exists()).toBe(true);
      expect(modalBase.attributes("data-modal-name")).toBe("ModalOrganizationStatus");
    });

    it("displays organization application heading", () => {
      const wrapper = createWrapper();
      expect(wrapper.text()).toContain(
        "i18n.components.modal_organization_status.organization_application"
      );
    });

    it("renders DialogTitle", () => {
      const wrapper = createWrapper();
      expect(wrapper.find(".dialog-title-stub").exists()).toBe(true);
    });

    it("displays accepted status text", () => {
      const wrapper = createWrapper();
      expect(wrapper.text()).toContain(
        "i18n.components.modal_organization_status.status_accepted"
      );
    });

    it("applies accepted-green color classes to status text", () => {
      const wrapper = createWrapper();
      const statusH4 = wrapper.find("h4");
      expect(statusH4.classes()).toContain("text-accepted-green");
      expect(statusH4.classes()).toContain("dark:text-accepted-green");
    });
  });

  // MARK: Injected Data

  describe("Injected Data", () => {
    it("renders CardOrgApplicationVote with injected data", () => {
      const wrapper = createWrapper();
      const voteCard = wrapper.findComponent({ name: "CardOrgApplicationVote" });
      expect(voteCard.exists()).toBe(true);
      expect(voteCard.props("upVotes")).toBe(5);
      expect(voteCard.props("downVotes")).toBe(2);
      expect(voteCard.props("isVotingDisabled")).toBe(true);
    });

    it("renders Discussion with injected entries", () => {
      const wrapper = createWrapper();
      const discussion = wrapper.findComponent({ name: "Discussion" });
      expect(discussion.exists()).toBe(true);
      expect(discussion.props("discussionEntries")).toEqual(
        testModalData.discussionEntries
      );
    });

    it("passes organization to Discussion", () => {
      const wrapper = createWrapper();
      const discussion = wrapper.findComponent({ name: "Discussion" });
      expect(discussion.props("organization")).toEqual(testOrganization);
    });
  });

  // MARK: Modal State

  describe("Modal State", () => {
    it("closes modal via store on closeModal event", async () => {
      const pinia = createPinia();
      setActivePinia(pinia);
      const modals = useModals();
      modals.modals.ModalOrganizationStatus = { isOpen: true };

      const wrapper = mount(ModalOrganizationStatus, {
        props: { organization: testOrganization, isOpen: true },
        global: {
          plugins: [pinia],
          mocks: { $t: (key: string) => key },
          stubs: {
            ModalBase: ModalBaseStub,
            DialogTitle: DialogTitleStub,
            CardOrgApplicationVote: CardOrgApplicationVoteStub,
            Discussion: DiscussionStub,
          },
          provide: { modalOrganizationStatusData: testModalData },
        },
      });

      const modalBase = wrapper.findComponent({ name: "ModalBase" });
      await modalBase.vm.$emit("closeModal");
      await nextTick();

      expect(modals.modals.ModalOrganizationStatus.isOpen).toBe(false);
    });
  });
});
