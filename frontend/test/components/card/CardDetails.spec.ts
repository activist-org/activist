// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CardDetails from "../../../app/components/card/CardDetails.vue";
import { useModals } from "../../../app/stores/modals";
import { getEnglishText } from "../../../shared/utils/i18n";
import {
  createMockEvent,
  createMockPhysicalLocation,
} from "../../mocks/factories";
import render from "../../render";

const stubs = {
  ModalQRCodeBtn: { template: '<div data-testid="modal-qr-code-btn" />' },
  MetaTagOrganization: {
    props: ["organization"],
    template: '<div data-testid="meta-tag-organization" />',
  },
  MetaTagLocation: {
    props: ["location"],
    template: '<div data-testid="meta-tag-location">{{ location }}</div>',
  },
  MetaTagDates: {
    props: ["dates"],
    template: '<div data-testid="meta-tag-dates" />',
  },
};

const mockCanEdit = vi.hoisted(() => ({ value: true }));

mockNuxtImport("useUser", () => () => ({
  userIsSignedIn: true,
  userIsAdmin: false,
  roles: [],
  signOutUser: () => {},
  canDelete: () => false,
  canCreate: () => false,
  canView: () => true,
  canEdit: () => mockCanEdit.value,
  user: null,
}));

beforeEach(() => {
  mockCanEdit.value = true;
});

describe("CardDetails", () => {
  it("renders the header", async () => {
    await render(CardDetails, {
      props: { event: null },
      global: { stubs },
    });

    expect(
      screen.getByText(getEnglishText("i18n.components.card_details.header"))
    ).toBeTruthy();
  });

  it("renders nothing event-specific when event is null", async () => {
    await render(CardDetails, {
      props: { event: null },
      global: { stubs },
    });

    expect(screen.queryByTestId("modal-qr-code-btn")).toBeNull();
    expect(screen.queryByTestId("meta-tag-organization")).toBeNull();
    expect(screen.queryByTestId("meta-tag-location")).toBeNull();
    expect(screen.queryByTestId("meta-tag-dates")).toBeNull();
  });

  it("renders event details when an event is provided", async () => {
    const event = createMockEvent({
      onlineLocationLink: "https://example.com/stream",
      physicalLocation: createMockPhysicalLocation({
        addressOrName: "123 Main St, Springfield",
      }),
      times: [
        {
          startTime: "2024-01-01T10:00:00Z",
          endTime: "2024-01-01T12:00:00Z",
          allDay: false,
          date: "2024-01-01",
        },
      ],
    });

    await render(CardDetails, {
      props: { event },
      global: { stubs },
    });

    expect(screen.getByTestId("modal-qr-code-btn")).toBeTruthy();
    expect(screen.getByTestId("meta-tag-organization")).toBeTruthy();
    expect(screen.getByTestId("meta-tag-dates")).toBeTruthy();

    const link = screen.getByText(
      "https://example.com/stream"
    ).closest("a");
    expect(link).toBeTruthy();
    expect(link?.getAttribute("href")).toBe("https://example.com/stream");

    // Only the part of the address before the first comma is shown.
    expect(
      screen.getByTestId("meta-tag-location").textContent
    ).toContain("123 Main St");
  });

  it("shows the edit icon when the user can edit and opens the edit-text modal on click", async () => {
    const event = createMockEvent({ id: "event-1" });

    await render(CardDetails, {
      props: { event },
      global: { stubs },
    });

    const editIcon = screen.getByTestId("icon-edit");
    expect(editIcon).toBeTruthy();

    await fireEvent.click(editIcon);

    const modals = useModals();
    expect(modals.modals["ModalTextEvent"]?.isOpen).toBe(true);
    expect(modals.modals["ModalTextEvent"]?.props).toEqual({
      entityId: "event-1",
    });
  });

  it("hides the edit icon when the user cannot edit", async () => {
    mockCanEdit.value = false;
    const event = createMockEvent();

    await render(CardDetails, {
      props: { event },
      global: { stubs },
    });

    expect(screen.queryByTestId("icon-edit")).toBeNull();
  });
});
