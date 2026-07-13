// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import DropdownCreate from "../../../app/components/dropdown/DropdownCreate.vue";
import { useModals } from "../../../app/stores/modals";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../render";

describe("DropdownCreate", () => {
  it("renders the menu button with the create label and aria-label", async () => {
    await render(DropdownCreate);

    const menuButton = screen.getByRole("button", {
      name: getEnglishText("i18n.components.dropdown_create.create_aria_label"),
    });
    expect(menuButton.textContent).toContain(
      getEnglishText("i18n.components.dropdown_create.create")
    );
  });

  it("shows the new event, organization, and group options when opened", async () => {
    await render(DropdownCreate);

    const menuButton = screen.getByRole("button", {
      name: getEnglishText("i18n.components.dropdown_create.create_aria_label"),
    });
    await fireEvent.click(menuButton);

    const menuItems = await screen.findAllByRole("menuitem");
    expect(menuItems.map((item) => item.textContent?.trim())).toEqual([
      getEnglishText("i18n._global.new_event"),
      getEnglishText("i18n.components.dropdown_create.new_organization"),
      getEnglishText("i18n._global.new_group"),
    ]);
  });

  it("opens the create-event modal when the new event option is clicked", async () => {
    await render(DropdownCreate);

    await fireEvent.click(
      screen.getByRole("button", {
        name: getEnglishText(
          "i18n.components.dropdown_create.create_aria_label"
        ),
      })
    );
    const menuItems = await screen.findAllByRole("menuitem");
    await fireEvent.click(menuItems[0]!);

    const modals = useModals();
    expect(modals.modals["ModalCreateEvent"]?.isOpen).toBe(true);
  });

  it("opens the create-organization modal when the new organization option is clicked", async () => {
    await render(DropdownCreate);

    await fireEvent.click(
      screen.getByRole("button", {
        name: getEnglishText(
          "i18n.components.dropdown_create.create_aria_label"
        ),
      })
    );
    const menuItems = await screen.findAllByRole("menuitem");
    await fireEvent.click(menuItems[1]!);

    const modals = useModals();
    expect(modals.modals["ModalCreateOrganization"]?.isOpen).toBe(true);
  });

  it("opens the create-group modal when the new group option is clicked", async () => {
    await render(DropdownCreate);

    await fireEvent.click(
      screen.getByRole("button", {
        name: getEnglishText(
          "i18n.components.dropdown_create.create_aria_label"
        ),
      })
    );
    const menuItems = await screen.findAllByRole("menuitem");
    await fireEvent.click(menuItems[2]!);

    const modals = useModals();
    expect(modals.modals["ModalCreateGroup"]?.isOpen).toBe(true);
  });
});
