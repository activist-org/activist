// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CardGetInvolvedEvent from "../../../../app/components/card/get-involved/CardGetInvolvedEvent.vue";
import { getEnglishText } from "../../../../shared/utils/i18n";
import {
  createMockEvent,
  createMockEventText,
} from "../../../mocks/factories";
import render from "../../../render";
import {
  createUseRouteMock,
  createUseUserMock,
} from "../../../mocks/composableMocks";

const stubs = {
  IconEdit: { template: '<span data-testid="icon-edit" />' },
  BtnRouteInternal: {
    template: '<a :data-testid="ariaLabel" />',
    props: ["ariaLabel", "linkTo", "label", "cta", "fontSize", "iconSize", "rightIcon"],
  },
};

const { eventData, mockUserIsSignedIn } = vi.hoisted(() => ({
  eventData: { value: null as ReturnType<typeof createMockEvent> | null },
  mockUserIsSignedIn: { value: false },
}));

mockNuxtImport("useGetEvent", async () => {
  const { ref } = await import("vue");
  return () => ({ data: ref(eventData.value) });
});
mockNuxtImport(
  "useModalHandlers",
  () => () => ({ openModal: vi.fn() })
);
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
  eventData.value = null;
  mockUserIsSignedIn.value = false;
  vi.stubGlobal("useRoute", createUseRouteMock({ eventId: "event-1" }));
});

describe("CardGetInvolvedEvent", () => {
  it("renders the Participate heading", async () => {
    await render(CardGetInvolvedEvent, { global: { stubs } });

    expect(
      screen.getByText(getEnglishText("i18n.components._global.participate"))
    ).toBeTruthy();
  });

  it("shows the default subtext when event has no getInvolved text", async () => {
    eventData.value = createMockEvent({ texts: [] });

    await render(CardGetInvolvedEvent, { global: { stubs } });

    expect(
      screen.getByText(
        getEnglishText(
          "i18n.components.card_get_involved_event.participate_subtext"
        )
      )
    ).toBeTruthy();
  });

  it("shows the event's custom getInvolved text when present", async () => {
    eventData.value = createMockEvent({
      texts: [createMockEventText({ getInvolved: "Join our march!" })],
    });

    await render(CardGetInvolvedEvent, { global: { stubs } });

    expect(screen.getByText("Join our march!")).toBeTruthy();
  });

  it("renders the offer-to-help button", async () => {
    await render(CardGetInvolvedEvent, { global: { stubs } });

    expect(
      screen.getByTestId("i18n._global.offer_to_help_aria_label")
    ).toBeTruthy();
  });

  it("shows the edit icon when the user is signed in", async () => {
    mockUserIsSignedIn.value = true;

    await render(CardGetInvolvedEvent, { global: { stubs } });

    expect(screen.getByTestId("icon-edit")).toBeTruthy();
  });

  it("hides the edit icon when the user is not signed in", async () => {
    await render(CardGetInvolvedEvent, { global: { stubs } });

    expect(screen.queryByTestId("icon-edit")).toBeNull();
  });
});
