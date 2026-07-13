// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CardAboutGroup from "../../../../app/components/card/about/CardAboutGroup.vue";
import { useModals } from "../../../../app/stores/modals";
import { getEnglishText } from "../../../../shared/utils/i18n";
import { createUseRouteMock } from "../../../mocks/composableMocks";
import { createMockGroup, createMockGroupText } from "../../../mocks/factories";
import render from "../../../render";

const stubs = {
  ModalQRCodeBtn: { template: '<div data-testid="modal-qr-code-btn" />' },
};

const { groupData, mockUserIsSignedIn } = vi.hoisted(() => ({
  groupData: { value: null as ReturnType<typeof createMockGroup> | null },
  mockUserIsSignedIn: { value: true },
}));

mockNuxtImport("useGetGroup", async () => {
  const { ref } = await import("vue");
  return () => ({ data: ref(groupData.value) });
});

mockNuxtImport("useUser", () => () => ({
  userIsSignedIn: mockUserIsSignedIn.value,
  userIsAdmin: false,
  roles: [],
  signOutUser: () => {},
  canDelete: () => false,
  canCreate: () => false,
  canView: () => true,
  canEdit: () => true,
  user: null,
}));

beforeEach(() => {
  groupData.value = null;
  mockUserIsSignedIn.value = true;
  vi.stubGlobal("useRoute", createUseRouteMock({ groupId: "group-1" }));
});

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

describe("CardAboutGroup", () => {
  it("renders the About header and description", async () => {
    groupData.value = createMockGroup({
      texts: [createMockGroupText({ description: "A group of activists." })],
    });

    await render(CardAboutGroup, { global: { stubs } });

    expect(
      screen.getByText(getEnglishText("i18n._global.about"))
    ).toBeTruthy();
    expect(screen.getByText("A group of activists.")).toBeTruthy();
  });

  it("renders the group's location", async () => {
    groupData.value = createMockGroup();

    await render(CardAboutGroup, { global: { stubs } });

    expect(
      screen.getByText((text) => text.startsWith("Test City"))
    ).toBeTruthy();
  });

  it("renders the QR code button when a group is loaded", async () => {
    groupData.value = createMockGroup();

    await render(CardAboutGroup, { global: { stubs } });

    expect(screen.getByTestId("modal-qr-code-btn")).toBeTruthy();
  });

  it("shows the edit icon when signed in and opens the edit-text modal with the group id", async () => {
    groupData.value = createMockGroup({ id: "group-1" });

    await render(CardAboutGroup, { global: { stubs } });

    const editIcon = screen.getByTestId("icon-edit");
    expect(editIcon).toBeTruthy();

    await fireEvent.click(editIcon);

    const modals = useModals();
    expect(modals.modals["ModalTextGroup"]?.isOpen).toBe(true);
    expect(modals.modals["ModalTextGroup"]?.props).toEqual({
      entityId: "group-1",
    });
  });

  it("hides the edit icon when not signed in", async () => {
    mockUserIsSignedIn.value = false;
    groupData.value = createMockGroup();

    await render(CardAboutGroup, { global: { stubs } });

    expect(screen.queryByTestId("icon-edit")).toBeNull();
  });

  it("shows the expand button when the description overflows, and toggles to collapse on click", async () => {
    groupData.value = createMockGroup();

    const { container, emitted } = await render(CardAboutGroup, {
      global: { stubs },
    });

    const paragraph = container.querySelector("p.line-clamp-5")!;
    makeOverflow(paragraph);
    window.dispatchEvent(new Event("resize"));

    const expandButton = await vi.waitFor(() =>
      screen.getByTestId("expand-text-button")
    );

    await fireEvent.click(expandButton);

    expect(screen.getByTestId("collapse-text-button")).toBeTruthy();
    expect(emitted()["expand-reduce-text"]).toBeTruthy();
  });
});
