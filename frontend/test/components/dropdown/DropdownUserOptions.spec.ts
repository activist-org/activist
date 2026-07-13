// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DropdownUserOptions from "../../../app/components/dropdown/DropdownUserOptions.vue";
import { useModals } from "../../../app/stores/modals";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../render";

const mockUserIsSignedIn = vi.hoisted(() => ({ value: true }));
const mockClear = vi.hoisted(() => vi.fn());

mockNuxtImport("useUser", () => () => ({
  userIsSignedIn: mockUserIsSignedIn.value,
  userIsAdmin: false,
  roles: [],
  signOutUser: () => {},
  canDelete: () => false,
  canCreate: () => false,
  canView: () => true,
  canEdit: () => false,
  user: null,
}));

beforeEach(() => {
  mockUserIsSignedIn.value = true;
  mockClear.mockClear();
  vi.stubGlobal("useUserSession", () => ({
    loggedIn: { value: mockUserIsSignedIn.value },
    user: { value: null },
    clear: mockClear,
  }));
  vi.stubGlobal("useLocalePath", () => (path: string) => path);
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true } as Response)
  );
});

async function openMenu(ariaLabel: string) {
  const menuButton = screen.getByRole("button", { name: ariaLabel });
  await fireEvent.click(menuButton);
}

describe("DropdownUserOptions", () => {
  it("shows the username label when signed in", async () => {
    await render(DropdownUserOptions);

    const menuButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.dropdown_user_options.username_aria_label"
      ),
    });
    expect(menuButton.textContent).toContain(
      getEnglishText("i18n.components.dropdown_user_options.username")
    );
  });

  it("shows the signed-in options menu", async () => {
    await render(DropdownUserOptions);

    await openMenu(
      getEnglishText(
        "i18n.components.dropdown_user_options.username_aria_label"
      )
    );

    const menuItems = await screen.findAllByRole("menuitem");
    expect(menuItems.map((item) => item.textContent?.trim())).toEqual([
      getEnglishText("i18n.components.dropdown_user_options.your_profile"),
      getEnglishText("i18n.components.dropdown_user_options.your_events"),
      getEnglishText("i18n.components.dropdown_user_options.your_orgs"),
      getEnglishText("i18n._global.notifications"),
      getEnglishText("i18n._global.settings"),
      getEnglishText("i18n.components.dropdown_user_options.sign_out"),
    ]);
  });

  it("opens the create-event modal when 'Your events' is clicked", async () => {
    await render(DropdownUserOptions);

    await openMenu(
      getEnglishText(
        "i18n.components.dropdown_user_options.username_aria_label"
      )
    );
    await fireEvent.click(
      screen.getByTestId("user-options-your-events")
    );

    const modals = useModals();
    expect(modals.modals["ModalCreateEvent"]?.isOpen).toBe(true);
  });

  it("clears the session on sign-out", async () => {
    await render(DropdownUserOptions);

    await openMenu(
      getEnglishText(
        "i18n.components.dropdown_user_options.username_aria_label"
      )
    );
    await fireEvent.click(
      screen.getByTestId("user-options-your-sign-out")
    );

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "api/public/logout",
      expect.objectContaining({ method: "POST" })
    );
    await vi.waitFor(() => {
      expect(mockClear).toHaveBeenCalled();
    });
  });

  it("shows the sign-up and sign-in options when signed out", async () => {
    mockUserIsSignedIn.value = false;

    await render(DropdownUserOptions);

    const menuButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.dropdown_user_options.username_aria_label"
      ),
    });
    expect(menuButton.textContent).toContain(
      getEnglishText("i18n.components.dropdown_user_options.join_activist")
    );

    await fireEvent.click(menuButton);
    const menuItems = await screen.findAllByRole("menuitem");
    expect(menuItems.map((item) => item.textContent?.trim())).toEqual([
      getEnglishText("i18n._global.sign_up"),
      getEnglishText("i18n._global.sign_in"),
    ]);
  });
});
