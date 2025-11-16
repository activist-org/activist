// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";

import BtnActionDropdown from "~/components/btn/action/BtnActionDropdown.vue";

import { renderButton } from "../helpers";

vi.mock("@headlessui/vue", () => ({
  Menu: {
    template: '<div data-testid="menu"><slot /></div>',
  },
  MenuButton: {
    template:
      '<button data-testid="menu-button" :class="$attrs.class" @click="$emit(\'click\')"><slot /></button>',
    emits: ["click"],
  },
  MenuItems: {
    template:
      '<div data-testid="menu-items" :class="$attrs.class"><slot /></div>',
  },
  MenuItem: {
    template:
      '<div data-testid="menu-item" :class="$attrs.class" @click="$emit(\'click\')"><slot v-bind="{ active: false }" /></div>',
    emits: ["click"],
  },
}));

describe("BtnActionDropdown", () => {
  const mockCallback = vi.fn();
  const defaultProps = {
    cta: true,
    fontSize: "base" as const,
    ariaLabel: "i18n.test.main",
    ariaLabelDropdown: "i18n.test.dropdown",
    dropdownIcon: "bi:chevron-down",
    dropdownOptions: ["Option 1", "Option 2"],
    dropdownOptionsCallback: mockCallback,
    label: "i18n.test.label",
    leftIcon: "bi:filter",
    iconSize: "1em",
  };

  it("renders Menu with MenuButton and MenuItems", async () => {
    await renderButton(BtnActionDropdown, defaultProps, { Icon: true });

    expect(screen.getByTestId("menu")).toBeTruthy();
    expect(screen.getByTestId("menu-button")).toBeTruthy();
    expect(screen.getByTestId("menu-items")).toBeTruthy();
  });

  it("renders all dropdown options", async () => {
    await renderButton(BtnActionDropdown, defaultProps, { Icon: true });

    const menuItems = screen.getAllByTestId("menu-item");
    expect(menuItems).toHaveLength(2);
  });

  it("applies style-cta class when cta is true", async () => {
    await renderButton(
      BtnActionDropdown,
      { ...defaultProps, cta: true },
      { Icon: true }
    );

    const menuButton = screen.getByTestId("menu-button");
    expect(menuButton.className).toContain("style-cta");
  });
});
