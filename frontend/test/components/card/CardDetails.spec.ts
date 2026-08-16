// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CardDetails from "../../../../app/components/card/CardDetails.vue";
import { getEnglishText } from "../../../shared/utils/i18n";
import { createMockEvent, createMockOrganization } from "../../mocks/factories";
import render from "../../render";

const { openModalMock } = vi.hoisted(() => ({
  openModalMock: vi.fn(),
}));

mockNuxtImport("useModalHandlers", () => (modalName: string) => ({
  openModal: openModalMock,
  handleCloseModal: vi.fn(),
  modalName,
}));

mockNuxtImport("useLinkURL", () => () => ({
  linkUrl: { value: "https://example.com/events/event-1" },
}));

mockNuxtImport("useUser", () => () => ({
  canEdit: () => true,
}));

const stubs = {
  ModalQRCodeBtn: { template: "<div />" },
  MetaTagOrganization: { template: "<div />" },
  MetaTagLocation: { template: "<div />" },
  MetaTagDates: { template: "<div />" },
  Icon: { template: "<span />" },
};

describe("CardDetails", () => {
  beforeEach(() => {
    openModalMock.mockClear();
  });

  it("renders the Details heading", async () => {
    await render(CardDetails, {
      props: { event: createMockEvent() },
      global: { stubs },
    });

    expect(
      screen.getByText(getEnglishText("i18n.components.card_details.header"))
    ).toBeTruthy();
  });

  it("opens ModalEventDetails when the Details edit icon is clicked", async () => {
    const event = createMockEvent({
      id: "event-123",
      orgs: [createMockOrganization({ id: "org-1", name: "Org One" })],
    });

    await render(CardDetails, {
      props: { event },
      global: { stubs },
    });

    await fireEvent.click(screen.getByTestId("edit-event-details"));

    expect(openModalMock).toHaveBeenCalledTimes(1);
    expect(openModalMock).toHaveBeenCalledWith({
      entityId: "event-123",
    });
  });
});
