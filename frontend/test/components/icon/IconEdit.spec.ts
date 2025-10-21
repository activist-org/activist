import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

import IconEdit from "~/components/icon/IconEdit.vue";

describe("Tests for IconEdit", () => {
  const entityMock = { id: 1, name: "test-entity", createdBy: 1 };

  it("renders icon when user is admin", async () => {
    // Override useUser for this test
    globalThis.data = { value: { user: { id: 1, isAdmin: true } } };

    const wrapper = mount(IconEdit, {
      props: { entity: entityMock },
    });
    expect(wrapper.find("[data-testid='icon-edit']").exists()).toBe(true);
  });

  it("does not render icon when user is not admin", async () => {
    globalThis.data = { value: { user: { id: 2, isAdmin: false } } };
    const wrapper = mount(IconEdit, {
      props: { entity: entityMock },
    });
    expect(wrapper.find("[data-testid='icon-edit']").exists()).toBe(false);
  });

  it("user can edit if they are the creator", () => {
    globalThis.data = { value: { user: { id: 1, isAdmin: false } } };
    const wrapper = mount(IconEdit, {
      props: { entity: entityMock },
    });

    expect(wrapper.find("[data-testid='icon-edit']").exists()).toBe(true);
  });

  it("handles undefined entity", () => {
    const wrapper = mount(IconEdit, {
      props: { entity: undefined },
      global: {
        stubs: {
          Icon: {
            template: "<span data-testid='mock-icon'></span>",
          },
        },
      },
    });
    expect(wrapper.find("[data-testid='icon-edit']").exists()).toBe(false);
  });
});
