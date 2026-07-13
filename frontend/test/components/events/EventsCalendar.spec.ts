// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import EventsCalendar from "../../../app/components/events/EventsCalendar.vue";
import { createMockEvent } from "../../mocks/factories";
import render from "../../render";

const stubs = {
  MediaCalendar: {
    props: ["calendarArgs"],
    template: `
      <div data-testid="media-calendar">
        <div v-for="item in calendarArgs" :key="item.key">
          <slot :customData="item.customData" />
        </div>
      </div>
    `,
  },
};

beforeEach(() => {
  vi.stubGlobal("useLocalePath", () => (path: string) => path);
});

describe("EventsCalendar", () => {
  it("renders a calendar entry for an action event", async () => {
    const event = createMockEvent({
      id: "event-1",
      name: "Climate March",
      type: "action",
      times: [
        { startTime: "", endTime: "", allDay: false, date: "2024-01-01" },
      ],
    });

    const { container } = await render(EventsCalendar, {
      props: { events: [event] },
      global: { stubs },
    });

    expect(screen.getByText("Climate March")).toBeTruthy();
    const link = container.querySelector("a[href='/events/event-1']");
    expect(link).toBeTruthy();
  });

  it("renders a calendar entry for a learn event", async () => {
    const event = createMockEvent({
      id: "event-2",
      name: "Know Your Rights Workshop",
      type: "learn",
      times: [
        { startTime: "", endTime: "", allDay: false, date: "2024-01-02" },
      ],
    });

    await render(EventsCalendar, {
      props: { events: [event] },
      global: { stubs },
    });

    expect(screen.getByText("Know Your Rights Workshop")).toBeTruthy();
  });

  it("renders one entry per event when there are both action and learn events", async () => {
    const events = [
      createMockEvent({
        id: "event-1",
        name: "Climate March",
        type: "action",
        times: [
          { startTime: "", endTime: "", allDay: false, date: "2024-01-01" },
        ],
      }),
      createMockEvent({
        id: "event-2",
        name: "Know Your Rights Workshop",
        type: "learn",
        times: [
          { startTime: "", endTime: "", allDay: false, date: "2024-01-02" },
        ],
      }),
    ];

    const { container } = await render(EventsCalendar, {
      props: { events },
      global: { stubs },
    });

    expect(
      container.querySelectorAll("[data-testid='media-calendar'] a").length
    ).toBe(2);
  });
});
