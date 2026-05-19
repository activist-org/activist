// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import EntityLogoMobile from "../../../app/components/entity/EntityLogoMobile.vue";
import { createUseUserSessionMock } from "../../mocks/composableMocks";

type MobileEntityLogoProps = {
  entity: { id: string; name: string; createdBy: string } | null;
  icon: string;
  imgUrl?: string;
  tagline?: string;
};

function mountEntityLogoMobile(props: MobileEntityLogoProps) {
  return mount(EntityLogoMobile, {
    props,
    global: {
      stubs: {
        Icon: true,
      },
    },
  });
}

describe("EntityLogoMobile.vue", () => {
  beforeEach(() => {
    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: "user-1",
      isAdmin: true,
    });
  });

  it("renders the image and emits edit when the editable shortcut is clicked", async () => {
    const wrapper = mountEntityLogoMobile({
      entity: { id: "org-1", name: "Food Collective", createdBy: "user-1" },
      icon: "bi:building",
      imgUrl: "/api/org-icon.png",
      tagline: "Local mutual aid",
    });

    expect(wrapper.get("img").attributes("src")).toBe("/api/org-icon.png");
    expect(wrapper.get("img").attributes("alt")).toContain("Food Collective");

    await wrapper
      .get('[data-testid="entity-logo-mobile-edit"]')
      .trigger("click");

    expect(wrapper.emitted("edit")).toHaveLength(1);
  });

  it("renders the provided icon when there is no image URL", () => {
    const wrapper = mountEntityLogoMobile({
      entity: {
        id: "group-1",
        name: "Neighborhood Group",
        createdBy: "user-1",
      },
      icon: "bi:people",
      imgUrl: "",
    });

    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.getComponent({ name: "Icon" }).attributes("name")).toBe(
      "bi:people"
    );
  });

  it("hides the edit shortcut when the user cannot edit the entity", () => {
    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: "user-2",
      isAdmin: false,
    });

    const wrapper = mountEntityLogoMobile({
      entity: { id: "event-1", name: "Repair Workshop", createdBy: "user-1" },
      icon: "bi:calendar-event",
      imgUrl: "/api/event-icon.png",
    });

    expect(
      wrapper.find('[data-testid="entity-logo-mobile-edit"]').exists()
    ).toBe(false);
  });
});
