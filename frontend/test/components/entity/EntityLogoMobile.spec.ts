// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import EntityLogoMobile from "../../../app/components/entity/EntityLogoMobile.vue";
import { EntityType } from "../../../shared/types/entity";
import { createUseUserSessionMock } from "../../mocks/composableMocks";

const { openModal, showToastError } = vi.hoisted(() => ({
  openModal: vi.fn(),
  showToastError: vi.fn(),
}));

mockNuxtImport("useModalHandlers", () => () => ({ openModal }));
mockNuxtImport("useToaster", () => () => ({ showToastError }));

const imageOrganizationStub = {
  props: ["alt", "imgUrl"],
  template: '<img data-testid="organization-logo" :alt="alt" :src="imgUrl" />',
};

const imageEventStub = {
  props: ["alt", "eventType", "imgUrl"],
  template:
    '<img data-testid="event-logo" :alt="alt" :data-event-type="eventType" :src="imgUrl" />',
};

type MobileEntityLogoProps = {
  entity: { id: string; name: string; createdBy: string } | null;
  entityType: EntityType;
  eventType?: "action" | "learn";
  imgUrl?: string;
  tagline?: string;
};

function mountEntityLogoMobile(props: MobileEntityLogoProps) {
  return mount(EntityLogoMobile, {
    props,
    global: {
      stubs: {
        Icon: true,
        ImageEvent: imageEventStub,
        ImageOrganization: imageOrganizationStub,
      },
    },
  });
}

describe("EntityLogoMobile.vue", () => {
  beforeEach(() => {
    openModal.mockClear();
    showToastError.mockClear();

    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: "user-1",
      isAdmin: true,
    });
  });

  it("opens the icon upload modal for editable organizations", async () => {
    const wrapper = mountEntityLogoMobile({
      entity: { id: "org-1", name: "Food Collective", createdBy: "user-1" },
      entityType: EntityType.ORGANIZATION,
      imgUrl: "/api/org-icon.png",
      tagline: "Local mutual aid",
    });

    expect(
      wrapper.get('[data-testid="organization-logo"]').attributes("src")
    ).toBe("/api/org-icon.png");

    await wrapper
      .get('[data-testid="entity-logo-mobile-edit"]')
      .trigger("click");

    expect(openModal).toHaveBeenCalledWith({
      entityId: "org-1",
      entityType: EntityType.ORGANIZATION,
    });
  });

  it("uses the existing coming-soon behavior for editable groups", async () => {
    const wrapper = mountEntityLogoMobile({
      entity: {
        id: "group-1",
        name: "Neighborhood Group",
        createdBy: "user-1",
      },
      entityType: EntityType.GROUP,
      imgUrl: "",
    });

    await wrapper
      .get('[data-testid="entity-logo-mobile-edit"]')
      .trigger("click");

    expect(showToastError).toHaveBeenCalledWith("THIS FEATURE IS COMING SOON!");
    expect(openModal).not.toHaveBeenCalled();
  });

  it("hides the edit shortcut when the user cannot edit the entity", () => {
    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: "user-2",
      isAdmin: false,
    });

    const wrapper = mountEntityLogoMobile({
      entity: { id: "event-1", name: "Repair Workshop", createdBy: "user-1" },
      entityType: EntityType.EVENT,
      eventType: "learn",
      imgUrl: "/api/event-icon.png",
    });

    expect(
      wrapper.find('[data-testid="entity-logo-mobile-edit"]').exists()
    ).toBe(false);
  });
});
