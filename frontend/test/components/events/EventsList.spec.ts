// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import EventsList from "../../../app/components/events/EventsList.vue";
import { createMockEvent } from "../../mocks/factories";
import render from "../../render";

const stubs = {
  CardSearchResultEntityEvent: {
    props: ["event", "isPrivate"],
    template: '<div data-testid="event-card">{{ event.name }}</div>',
  },
};

describe("EventsList", () => {
  it("renders nothing when there are no events", async () => {
    const { container } = await render(EventsList, {
      props: { events: [] },
      global: { stubs },
    });

    expect(container.querySelectorAll("[data-testid='event-card']").length).toBe(
      0
    );
  });

  it("renders one card per event", async () => {
    const events = [
      createMockEvent({ id: "event-1", name: "Climate March" }),
      createMockEvent({ id: "event-2", name: "Housing Rally" }),
    ];

    await render(EventsList, {
      props: { events },
      global: { stubs },
    });

    const cards = screen.getAllByTestId("event-card");
    expect(cards.length).toBe(2);
    expect(screen.getByText("Climate March")).toBeTruthy();
    expect(screen.getByText("Housing Rally")).toBeTruthy();
  });
});
