// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DropdownLanguage from "../../../app/components/dropdown/DropdownLanguage.vue";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../render";

beforeEach(() => {
  vi.stubGlobal("useI18n", () => ({
    locale: { value: "en" },
    locales: {
      value: [
        { code: "en", name: "English" },
        { code: "es", name: "Español" },
      ],
    },
  }));
  vi.stubGlobal("useSwitchLocalePath", () => (code: string) => `/${code}`);
});

describe("DropdownLanguage", () => {
  it("renders the menu button with the current locale and aria-label", async () => {
    await render(DropdownLanguage);

    const menuButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.dropdown_language.open_dropdown_aria_label"
      ),
    });
    expect(menuButton.textContent).toContain("en");
  });

  it("lists the other available locales, excluding the current one", async () => {
    await render(DropdownLanguage);

    const menuButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.dropdown_language.open_dropdown_aria_label"
      ),
    });
    await fireEvent.click(menuButton);

    expect(screen.getByText("Español")).toBeTruthy();
    expect(screen.queryByText("English")).toBeNull();
  });

  it("sets the document's lang attribute when a locale is selected", async () => {
    await render(DropdownLanguage);

    const menuButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.dropdown_language.open_dropdown_aria_label"
      ),
    });
    await fireEvent.click(menuButton);

    await fireEvent.click(screen.getByText("Español"));

    expect(document.documentElement.getAttribute("lang")).toBe("es");
  });
});
