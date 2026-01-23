// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import MenuLinkWrapper from "../../../app/components/menu/MenuLinkWrapper.vue";
import { createUseLocalePathMock } from "../../mocks/composableMocks";
import render from "../../../test/render";

// Explicitly set up useLocalePath mock using factory.
globalThis.useLocalePath = createUseLocalePathMock();

const baseProps = {
  to: "/settings",
  selected: false,
  isAddStyles: true,
};

const renderLink = (overrideProps: Partial<typeof baseProps> = {}) =>
  render(MenuLinkWrapper, {
    props: { ...baseProps, ...overrideProps },
    slots: {
      default: "Settings",
    },
  });

describe("MenuLinkWrapper", () => {
  it("renders a NuxtLink with the provided label", async () => {
    await renderLink();
    const link = screen.getByRole("link", { name: /settings/i });

    expect(link).toBeTruthy();

    const classTokens = (link as HTMLElement).className.split(/\s+/);
    expect(classTokens).toContain("group");
    expect(classTokens).toContain("p-2"); // default isAddStyles = true
  });

  it("applies CTA styles when selected = true", async () => {
    const { container } = await renderLink({ selected: true });
    const link = container.querySelector("a") as HTMLElement;

    const classTokens = link.className.split(/\s+/);
    expect(classTokens).toContain("style-menu-option-cta");
    expect(classTokens).not.toContain("style-menu-option");
  });

  it("applies regular styles when not selected", async () => {
    const { container } = await renderLink({ selected: false });
    const link = container.querySelector("a") as HTMLElement;

    const classTokens = link.className.split(/\s+/);
    expect(classTokens).toContain("style-menu-option");
    expect(classTokens).not.toContain("style-menu-option-cta");
  });

  it("does not add extra style classes when isAddStyles = false", async () => {
    const { container } = await renderLink({
      selected: false,
      isAddStyles: false,
    });
    const link = container.querySelector("a") as HTMLElement;

    const classTokens = link.className.split(/\s+/);
    expect(classTokens).not.toContain("style-menu-option");
    expect(classTokens).not.toContain("style-menu-option-cta");
    expect(classTokens).not.toContain("p-2");
  });
});
