// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TooltipMenuSearchResultEvent from "../../../../app/components/tooltip/menu-search-result/TooltipMenuSearchResultEvent.vue";
import { createMockEvent } from "../../../mocks/factories";
import render from "../../../render";

const { mockDownloadEventCalendar } = vi.hoisted(() => ({
  mockDownloadEventCalendar: vi.fn(),
}));

mockNuxtImport("useDownloadEventCalendar", () => () => ({
  downloadEventCalendar: mockDownloadEventCalendar,
}));
mockNuxtImport("useModalHandlers", () => () => ({ openModal: vi.fn() }));
mockNuxtImport("useTabNavigationEmit", () => () => ({
  handleTabPress: vi.fn(),
}));

const stubs = {
  TooltipBase: { template: "<div><slot /></div>" },
  BtnAction: {
    emits: ["click"],
    props: ["ariaLabel"],
    template:
      '<button :data-testid="ariaLabel" @click="$emit(\'click\')"></button>',
  },
};

describe("TooltipMenuSearchResultEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("downloads the calendar entry for the selected event", async () => {
    const event = createMockEvent({ id: "tooltip-event-id" });
    await render(TooltipMenuSearchResultEvent, {
      props: { event },
      global: { stubs },
    });

    await fireEvent.click(
      screen.getByTestId("i18n._global.subscribe_to_event_aria_label")
    );

    expect(mockDownloadEventCalendar).toHaveBeenCalledOnce();
    expect(mockDownloadEventCalendar).toHaveBeenCalledWith("tooltip-event-id");
  });

  it("relies on the native click for Enter activation", async () => {
    const event = createMockEvent({ id: "tooltip-event-id" });
    await render(TooltipMenuSearchResultEvent, {
      props: { event },
      global: { stubs },
    });
    const button = screen.getByTestId(
      "i18n._global.subscribe_to_event_aria_label"
    );

    await fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
    await fireEvent.click(button);

    expect(mockDownloadEventCalendar).toHaveBeenCalledOnce();
    expect(mockDownloadEventCalendar).toHaveBeenCalledWith("tooltip-event-id");
  });
});
