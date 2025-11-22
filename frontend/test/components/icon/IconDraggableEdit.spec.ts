// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import IconDraggableEdit from "../../../app/components/icon/IconDraggableEdit.vue";

describe("Tests for IconDraggableEdit", () => {
  const entityMock = { id: 1, name: "test-entity", createdBy: 1 };

  it("renders icon when user is admin", async () => {
    // Override useUser for this test.
    globalThis.data = { value: { user: { id: 1, isAdmin: true } } };

    const wrapper = mount(IconDraggableEdit, {
      props: { entity: entityMock },
    });
    expect(wrapper.find("[data-testid='icon-edit-draggable']").exists()).toBe(
      true
    );
  });

  it("does not render icon when user is not admin", async () => {
    globalThis.data = { value: { user: { id: 2, isAdmin: false } } };
    const wrapper = mount(IconDraggableEdit, {
      props: { entity: entityMock },
    });
    expect(wrapper.find("[data-testid='icon-edit-draggable']").exists()).toBe(
      false
    );
  });

  it("user can edit if they are the creator", () => {
    globalThis.data = { value: { user: { id: 1, isAdmin: false } } };
    const wrapper = mount(IconDraggableEdit, {
      props: { entity: entityMock },
    });

    expect(wrapper.find("[data-testid='icon-edit-draggable']").exists()).toBe(
      true
    );
  });

  it("handles undefined entity", () => {
    const wrapper = mount(IconDraggableEdit, {
      props: { entity: undefined },
      global: {
        stubs: {
          Icon: {
            template: "<span data-testid='mock-icon'></span>",
          },
        },
      },
    });
    expect(wrapper.find("[data-testid='icon-edit-draggable']").exists()).toBe(
      false
    );
  });
});
