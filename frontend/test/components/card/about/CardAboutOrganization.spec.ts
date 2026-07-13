// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CardAboutOrganization from "../../../../app/components/card/about/CardAboutOrganization.vue";
import { useModals } from "../../../../app/stores/modals";
import { getEnglishText } from "../../../../shared/utils/i18n";
import { createUseRouteMock } from "../../../mocks/composableMocks";
import {
  createMockOrganization,
  createMockOrganizationText,
} from "../../../mocks/factories";
import render from "../../../render";

const stubs = {
  ModalQRCodeBtn: { template: '<div data-testid="modal-qr-code-btn" />' },
};

const { organizationData, mockUserIsSignedIn } = vi.hoisted(() => ({
  organizationData: {
    value: null as ReturnType<typeof createMockOrganization> | null,
  },
  mockUserIsSignedIn: { value: true },
}));

mockNuxtImport("useGetOrganization", async () => {
  const { ref } = await import("vue");
  return () => ({ data: ref(organizationData.value) });
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
  organizationData.value = null;
  mockUserIsSignedIn.value = true;
  vi.stubGlobal("useRoute", createUseRouteMock({ orgId: "org-1" }));
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

describe("CardAboutOrganization", () => {
  it("renders the About header and description", async () => {
    organizationData.value = createMockOrganization({
      texts: [
        createMockOrganizationText({
          description: "An organization for activists.",
        }),
      ],
    });

    await render(CardAboutOrganization, { global: { stubs } });

    expect(
      screen.getByText(getEnglishText("i18n._global.about"))
    ).toBeTruthy();
    expect(screen.getByText("An organization for activists.")).toBeTruthy();
  });

  it("renders the organization's location", async () => {
    organizationData.value = createMockOrganization();

    await render(CardAboutOrganization, { global: { stubs } });

    expect(
      screen.getByText((text) => text.startsWith("Test City"))
    ).toBeTruthy();
  });

  it("renders the QR code button when an organization is loaded", async () => {
    organizationData.value = createMockOrganization();

    await render(CardAboutOrganization, { global: { stubs } });

    expect(screen.getByTestId("modal-qr-code-btn")).toBeTruthy();
  });

  it("shows the edit icon when signed in and opens the edit-text modal with the organization id", async () => {
    organizationData.value = createMockOrganization({ id: "org-1" });

    await render(CardAboutOrganization, { global: { stubs } });

    const editIcon = screen.getByTestId("icon-edit");
    expect(editIcon).toBeTruthy();

    await fireEvent.click(editIcon);

    const modals = useModals();
    expect(modals.modals["ModalTextOrganization"]?.isOpen).toBe(true);
    expect(modals.modals["ModalTextOrganization"]?.props).toEqual({
      entityId: "org-1",
    });
  });

  it("hides the edit icon when not signed in", async () => {
    mockUserIsSignedIn.value = false;
    organizationData.value = createMockOrganization();

    await render(CardAboutOrganization, { global: { stubs } });

    expect(screen.queryByTestId("icon-edit")).toBeNull();
  });

  it("shows the expand button when the description overflows, and toggles to collapse on click", async () => {
    organizationData.value = createMockOrganization();

    const { container, emitted } = await render(CardAboutOrganization, {
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
