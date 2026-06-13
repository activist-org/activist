// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CardGetInvolvedOrganization from "../../../../app/components/card/get-involved/CardGetInvolvedOrganization.vue";
import { getEnglishText } from "../../../../shared/utils/i18n";
import { createUseRouteMock } from "../../../mocks/composableMocks";
import {
  createMockGroup,
  createMockOrganization,
  createMockOrganizationText,
} from "../../../mocks/factories";
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
  Feed: true,
};

const { orgData, mockUserIsSignedIn } = vi.hoisted(() => ({
  orgData: { value: null as ReturnType<typeof createMockOrganization> | null },
  mockUserIsSignedIn: { value: false },
}));

mockNuxtImport("useGetOrganization", async () => {
  const { ref } = await import("vue");
  return () => ({ data: ref(orgData.value) });
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
  orgData.value = null;
  mockUserIsSignedIn.value = false;
  vi.stubGlobal("useRoute", createUseRouteMock({ orgId: "org-1" }));
});

describe("CardGetInvolvedOrganization", () => {
  it("renders the Get involved heading", async () => {
    await render(CardGetInvolvedOrganization, { global: { stubs } });

    expect(
      screen.getByText(getEnglishText("i18n.components._global.get_involved"))
    ).toBeTruthy();
  });

  it("shows working-groups subtext when the organization has groups", async () => {
    orgData.value = createMockOrganization({
      name: "Acme Org",
      groups: [createMockGroup()],
      texts: [createMockOrganizationText({ getInvolved: "" })],
    });

    await render(CardGetInvolvedOrganization, { global: { stubs } });

    expect(screen.getByText("Acme Org", { exact: false })).toBeTruthy();
  });

  it("shows a custom getInvolved text when org has groups and custom text", async () => {
    orgData.value = createMockOrganization({
      groups: [createMockGroup()],
      texts: [
        createMockOrganizationText({
          getInvolved: "Help us change the world!",
        }),
      ],
    });

    await render(CardGetInvolvedOrganization, { global: { stubs } });

    expect(screen.getByText("Help us change the world!")).toBeTruthy();
  });

  it("shows join-organization subtext when org has a getInvolvedUrl but no groups", async () => {
    orgData.value = createMockOrganization({
      name: "Acme Org",
      groups: [],
      texts: [
        createMockOrganizationText({
          getInvolved: "",
          getInvolvedUrl: "https://example.com/join",
        }),
      ],
    });

    await render(CardGetInvolvedOrganization, { global: { stubs } });

    expect(
      screen.getByTestId("i18n._global.join_organization_aria_label")
    ).toBeTruthy();
  });

  it("shows no-info text when org has neither groups nor a getInvolvedUrl", async () => {
    orgData.value = createMockOrganization({
      name: "Acme Org",
      groups: [],
      texts: [
        createMockOrganizationText({
          getInvolved: "",
          getInvolvedUrl: undefined,
        }),
      ],
    });

    await render(CardGetInvolvedOrganization, { global: { stubs } });

    expect(
      screen.queryByTestId("i18n._global.join_organization_aria_label")
    ).toBeNull();
    expect(
      screen.getByText("No information provided on joining Acme Org for now.")
    ).toBeTruthy();
  });

  it("shows the view-all-groups button when the organization has groups", async () => {
    orgData.value = createMockOrganization({
      groups: [createMockGroup()],
      texts: [createMockOrganizationText()],
    });

    await render(CardGetInvolvedOrganization, { global: { stubs } });

    expect(
      screen.getByTestId(
        "i18n.components.card_get_involved_organization.view_all_groups_aria_label"
      )
    ).toBeTruthy();
  });

  it("shows the edit icon when the user is signed in", async () => {
    mockUserIsSignedIn.value = true;

    await render(CardGetInvolvedOrganization, { global: { stubs } });

    expect(screen.getByTestId("icon-edit")).toBeTruthy();
  });

  it("hides the edit icon when the user is not signed in", async () => {
    await render(CardGetInvolvedOrganization, { global: { stubs } });

    expect(screen.queryByTestId("icon-edit")).toBeNull();
  });
});
