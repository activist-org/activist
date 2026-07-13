// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import EventsMap from "../../../app/components/events/EventsMap.vue";
import { createMockEvent } from "../../mocks/factories";
import render from "../../render";

const stubs = {
  MediaMapEvents: {
    props: ["events"],
    template: '<div data-testid="media-map-events" />',
  },
};

describe("EventsMap", () => {
  it("does not render the map when there are no events", async () => {
    await render(EventsMap, {
      props: { events: [] },
      global: { stubs },
    });

    expect(screen.queryByTestId("media-map-events")).toBeNull();
  });

  it("renders the map with the events when there are events", async () => {
    const events = [createMockEvent()];

    await render(EventsMap, {
      props: { events },
      global: { stubs },
    });

    expect(screen.getByTestId("media-map-events")).toBeTruthy();
  });
});
