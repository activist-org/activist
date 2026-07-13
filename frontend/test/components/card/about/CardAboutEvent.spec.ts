// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";

import CardAboutEvent from "../../../../app/components/card/about/CardAboutEvent.vue";
import { useModals } from "../../../../app/stores/modals";
import { getEnglishText } from "../../../../shared/utils/i18n";
import { createMockEvent, createMockEventText } from "../../../mocks/factories";
import render from "../../../render";

mockNuxtImport("useUser", () => () => ({
  userIsSignedIn: true,
  userIsAdmin: false,
  roles: [],
  signOutUser: () => {},
  canDelete: () => false,
  canCreate: () => false,
  canView: () => true,
  canEdit: () => true,
  user: null,
}));

function makeOverflow(paragraph: HTMLElement) {
  Object.defineProperty(paragraph, "scrollHeight", {
    configurable: true,
    value: 100,
  });
  Object.defineProperty(paragraph, "clientHeight", {
    configurable: true,
    value: 20,
  });
}

describe("CardAboutEvent", () => {
  it("renders the About header and description", async () => {
    const event = createMockEvent({
      texts: [createMockEventText({ description: "A great community event." })],
    });

    await render(CardAboutEvent, { props: { event } });

    expect(
      screen.getByText(getEnglishText("i18n._global.about"))
    ).toBeTruthy();
    expect(screen.getByText("A great community event.")).toBeTruthy();
  });

  it("opens the edit-text modal with the event id when the edit icon is clicked", async () => {
    const event = createMockEvent({ id: "event-1" });

    await render(CardAboutEvent, { props: { event } });

    await fireEvent.click(screen.getByTestId("icon-edit"));

    const modals = useModals();
    expect(modals.modals["ModalTextEvent"]?.isOpen).toBe(true);
    expect(modals.modals["ModalTextEvent"]?.props).toEqual({
      entityId: "event-1",
    });
  });

  it("does not show the expand button when the description does not overflow", async () => {
    const event = createMockEvent();

    await render(CardAboutEvent, { props: { event } });

    expect(
      screen.queryByText(
        getEnglishText("i18n.components.card.about._global.full_text")
      )
    ).toBeNull();
  });

  it("shows the expand button when the description overflows, and toggles to collapse on click", async () => {
    const event = createMockEvent();

    const { container, emitted } = await render(CardAboutEvent, {
      props: { event },
    });

    const paragraph = container.querySelector("p")!;
    makeOverflow(paragraph);
    window.dispatchEvent(new Event("resize"));

    const expandButton = await vi.waitFor(() =>
      screen.getByText(
        getEnglishText("i18n.components.card.about._global.full_text")
      )
    );

    await fireEvent.click(expandButton);

    expect(
      screen.getByText(
        getEnglishText("i18n.components.card.about._global.reduce_text")
      )
    ).toBeTruthy();
    expect(emitted()["expand-reduce-text"]).toBeTruthy();
  });
});
