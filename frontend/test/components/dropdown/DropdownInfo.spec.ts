// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DropdownInfo from "../../../app/components/dropdown/DropdownInfo.vue";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../render";

beforeEach(() => {
  vi.stubGlobal("useLocalePath", () => (path: string) => path);
});

describe("DropdownInfo", () => {
  it("renders the menu button with the info label and aria-label", async () => {
    await render(DropdownInfo);

    const menuButton = screen.getByRole("button", {
      name: getEnglishText("i18n.components.dropdown_info.info_aria_label"),
    });
    expect(menuButton.textContent).toContain(
      getEnglishText("i18n.components.dropdown_info.info")
    );
  });

  it("shows the help, documentation, and legal links when opened", async () => {
    await render(DropdownInfo);

    const menuButton = screen.getByRole("button", {
      name: getEnglishText("i18n.components.dropdown_info.info_aria_label"),
    });
    await fireEvent.click(menuButton);

    const menuItems = await screen.findAllByRole("menuitem");
    expect(menuItems.map((item) => item.textContent?.trim())).toEqual([
      getEnglishText("i18n.components.dropdown_info.help"),
      getEnglishText("i18n.components._global.documentation"),
      getEnglishText("i18n.components.dropdown_info.legal"),
    ]);
  });
});
