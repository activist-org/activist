// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import IconEdit from "../../../app/components/icon/IconEdit.vue";
import { createUseUserSessionMock } from "../../mocks/composableMocks";

describe("Tests for IconEdit", () => {
  const entityMock = { id: 1, name: "test-entity", createdBy: 1 };

  it("renders icon when user is admin", async () => {
    // Override useUserSession for this test.
    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: 1,
      isAdmin: true,
    });

    const wrapper = mount(IconEdit, {
      props: { entity: entityMock },
    });
    expect(wrapper.find("[data-testid='icon-edit']").exists()).toBe(true);
  });

  it("does not render icon when user is not admin", async () => {
    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: 2,
      isAdmin: false,
    });
    const wrapper = mount(IconEdit, {
      props: { entity: entityMock },
    });
    expect(wrapper.find("[data-testid='icon-edit']").exists()).toBe(false);
  });

  it("user can edit if they are the creator", () => {
    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: 1,
      isAdmin: false,
    });
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
