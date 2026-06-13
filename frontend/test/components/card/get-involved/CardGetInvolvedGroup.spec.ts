// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CardGetInvolvedGroup from "../../../../app/components/card/get-involved/CardGetInvolvedGroup.vue";
import { getEnglishText } from "../../../../shared/utils/i18n";
import { createUseRouteMock } from "../../../mocks/composableMocks";
import { createMockGroup, createMockGroupText } from "../../../mocks/factories";
import render from "../../../render";

const stubs = {
  IconEdit: { template: '<span data-testid="icon-edit" />' },
  BtnRouteInternal: {
    template: '<a :data-testid="ariaLabel" />',
    props: [
      "ariaLabel",
      "linkTo",
      "label",
      "cta",
      "fontSize",
      "iconSize",
      "rightIcon",
    ],
  },
};

const { groupData, mockUserIsSignedIn } = vi.hoisted(() => ({
  groupData: { value: null as ReturnType<typeof createMockGroup> | null },
  mockUserIsSignedIn: { value: false },
}));

mockNuxtImport("useGetGroup", async () => {
  const { ref } = await import("vue");
  return () => ({ data: ref(groupData.value) });
});
mockNuxtImport("useModalHandlers", () => () => ({ openModal: vi.fn() }));
mockNuxtImport("useUser", async () => {
  const { ref } = await import("vue");
  return () => ({
    userIsSignedIn: ref(mockUserIsSignedIn.value),
    canEdit: () => false,
    canView: () => true,
    canCreate: () => false,
    canDelete: () => false,
    signOutUser: vi.fn(),
    user: null,
  });
});

beforeEach(() => {
  groupData.value = null;
  mockUserIsSignedIn.value = false;
  vi.stubGlobal("useRoute", createUseRouteMock({ groupId: "group-1" }));
});

describe("CardGetInvolvedGroup", () => {
  it("renders the Get involved heading", async () => {
    await render(CardGetInvolvedGroup, { global: { stubs } });

    expect(
      screen.getByText(getEnglishText("i18n.components._global.get_involved"))
    ).toBeTruthy();
  });

  it("shows the default subtext when group has no getInvolved text", async () => {
    groupData.value = createMockGroup({ name: "Test Group", texts: [] });

    await render(CardGetInvolvedGroup, { global: { stubs } });

    expect(screen.getByText("Test Group", { exact: false })).toBeTruthy();
  });

  it("shows the group's custom getInvolved text when present", async () => {
    groupData.value = createMockGroup({
      texts: [createMockGroupText({ getInvolved: "Volunteer with us!" })],
    });

    await render(CardGetInvolvedGroup, { global: { stubs } });

    expect(screen.getByText("Volunteer with us!")).toBeTruthy();
  });

  it("shows the join button when the group has a getInvolvedUrl", async () => {
    groupData.value = createMockGroup({
      texts: [
        createMockGroupText({ getInvolvedUrl: "https://example.com/join" }),
      ],
    });

    await render(CardGetInvolvedGroup, { global: { stubs } });

    expect(screen.getByTestId("get-involved-join-button")).toBeTruthy();
  });

  it("hides the join button when the group has no getInvolvedUrl", async () => {
    groupData.value = createMockGroup({
      texts: [createMockGroupText({ getInvolvedUrl: undefined })],
    });

    await render(CardGetInvolvedGroup, { global: { stubs } });

    expect(screen.queryByTestId("get-involved-join-button")).toBeNull();
  });

  it("shows the edit icon when the user is signed in", async () => {
    mockUserIsSignedIn.value = true;

    await render(CardGetInvolvedGroup, { global: { stubs } });

    expect(screen.getByTestId("icon-edit")).toBeTruthy();
  });

  it("hides the edit icon when the user is not signed in", async () => {
    await render(CardGetInvolvedGroup, { global: { stubs } });

    expect(screen.queryByTestId("icon-edit")).toBeNull();
  });
});
