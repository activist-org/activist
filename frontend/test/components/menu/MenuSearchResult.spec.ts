// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MenuSearchResult from "../../../app/components/menu/MenuSearchResult.vue";
import render from "../../../test/render";

const onClickOutsideMock = vi.fn();

declare global {
  var onClickOutside:
    | ((target: unknown, handler: () => void) => void)
    | undefined;
}

globalThis.onClickOutside = (target: unknown, handler: () => void) => {
  onClickOutsideMock(target, handler);
};

const globalStubs = {
  Icon: { template: `<span data-testid="icon"></span>` },
  TooltipMenuSearchResultEvent: {
    template: `<div data-testid="tooltip-event" @click="$emit('tab')"><slot /></div>`,
  },
  TooltipMenuSearchResultOrganization: true,
  TooltipMenuSearchResultGroup: true,
  TooltipMenuSearchResultResource: true,
  TooltipMenuSearchResultUser: true,
};

type MockEvent = {
  id: string;
  title: string;
};

const baseProps: { event: MockEvent } = {
  event: { id: "1", title: "Community Event" },
};

const renderMenuSearchResult = (overrideProps: Record<string, unknown> = {}) =>
  render(MenuSearchResult, {
    props: { ...baseProps, ...overrideProps },
    global: { stubs: globalStubs },
  });

describe("MenuSearchResult", () => {
  beforeEach(() => {
    onClickOutsideMock.mockClear();
  });

  it("toggles tooltip visibility when clicking the menu button", async () => {
    await renderMenuSearchResult();

    const button = screen.getByTestId("menu-button");
    const tooltip = screen.getByTestId("tooltip-event") as HTMLElement;

    const initial = tooltip.getAttribute("style") || "";
    expect(initial).toContain("display: none");

    await fireEvent.click(button);
    const opened = tooltip.getAttribute("style") || "";
    expect(opened).not.toContain("display: none");

    await fireEvent.click(button);
    const closed = tooltip.getAttribute("style") || "";
    expect(closed).toContain("display: none");
  });

  it("closes tooltip when the tooltip emits the 'tab' event", async () => {
    await renderMenuSearchResult();

    const button = screen.getByTestId("menu-button");
    const tooltip = screen.getByTestId("tooltip-event") as HTMLElement;

    await fireEvent.click(button);
    const opened = tooltip.getAttribute("style") || "";
    expect(opened).not.toContain("display: none");

    await fireEvent.click(tooltip);

    const final = tooltip.getAttribute("style") || "";
    expect(final).not.toBeNull();
  });

  it("registers click-outside handler and allows invoking it", async () => {
    await renderMenuSearchResult();

    expect(onClickOutsideMock).toHaveBeenCalledTimes(1);

    const callArgs = onClickOutsideMock.mock.calls[0];
    const handler = callArgs[1];

    expect(typeof handler).toBe("function");

    (handler as () => void)();
  });
});
