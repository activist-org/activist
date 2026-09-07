// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import EventAboutPage from "../../../app/pages/events/[eventId]/about.vue";
import render from "../../render";

const { mockDownloadEventCalendar } = vi.hoisted(() => ({
  mockDownloadEventCalendar: vi.fn(),
}));

mockNuxtImport("useRoute", () => () => ({
  params: { eventId: "about-event-id" },
}));
mockNuxtImport("useGetEvent", async () => {
  const { ref } = await import("vue");
  return () => ({ data: ref(null) });
});
mockNuxtImport("useDownloadEventCalendar", () => () => ({
  downloadEventCalendar: mockDownloadEventCalendar,
}));
mockNuxtImport("useModalHandlers", () => () => ({ openModal: vi.fn() }));

const stubs = {
  Head: { template: "<div><slot /></div>" },
  Title: { template: "<div><slot /></div>" },
  HeaderAppPageEvent: { template: "<div><slot /></div>" },
  BtnRouteExternal: true,
  BtnAction: {
    emits: ["click"],
    props: ["ariaLabel"],
    template:
      '<button :data-testid="ariaLabel" @click="$emit(\'click\')"></button>',
  },
  CardDetails: true,
  MediaMapEvent: true,
  MediaUrl: true,
  CardAboutEvent: true,
  CardGetInvolvedEvent: true,
  CardConnectEvent: true,
};

describe("event About page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("downloads the calendar entry using the route event ID", async () => {
    await render(EventAboutPage, { global: { stubs } });

    await fireEvent.click(
      screen.getByTestId("i18n._global.subscribe_to_event_aria_label")
    );

    expect(mockDownloadEventCalendar).toHaveBeenCalledOnce();
    expect(mockDownloadEventCalendar).toHaveBeenCalledWith("about-event-id");
  });

  it("relies on the native click for Enter activation", async () => {
    await render(EventAboutPage, { global: { stubs } });
    const button = screen.getByTestId(
      "i18n._global.subscribe_to_event_aria_label"
    );

    await fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
    await fireEvent.click(button);

    expect(mockDownloadEventCalendar).toHaveBeenCalledOnce();
    expect(mockDownloadEventCalendar).toHaveBeenCalledWith("about-event-id");
  });
});
