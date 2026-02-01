// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, describe, expect, it } from "vitest";

import MenuItemLabel from "../../../app/components/menu/MenuItemLabel.vue";
import render from "../../../test/render";
import { createUseUserSessionMock } from "../../mocks/composableMocks";

// Set up useUserSession mock (component uses it directly).
beforeEach(() => {
  globalThis.useUserSession = createUseUserSessionMock();
});

const baseProps = {
  isSidebarLeftMenu: false,
  isButton: true,
  handlerClick: undefined as (() => void) | undefined,
  iconName: undefined as string | undefined,
  ariaLabel: "Menu item",
  label: "Log out",
  active: false,
};

const renderMenuItem = (overrideProps: Partial<typeof baseProps> = {}) =>
  render(MenuItemLabel, {
    props: { ...baseProps, ...overrideProps },
  });

describe("MenuItemLabel", () => {
  it("renders a <button> when isButton = true", async () => {
    const { container } = await renderMenuItem({ isButton: true });
    const btn = container.querySelector("button");
    expect(btn).not.toBeNull();
  });

  it("renders an <li> when isButton = false", async () => {
    const { container } = await renderMenuItem({ isButton: false });
    const li = container.querySelector("li");
    expect(li).not.toBeNull();
  });

  it("applies active background classes when active = true", async () => {
    const { container } = await renderMenuItem({ active: true });
    const root =
      (container.querySelector("button") as HTMLElement) ??
      (container.querySelector("li") as HTMLElement);

    expect(root).not.toBeNull();
    expect(root.className).toContain("bg-cta-orange/80");
  });

  it("applies hover text classes when not active", async () => {
    const { container } = await renderMenuItem({ active: false });
    const root =
      (container.querySelector("button") as HTMLElement) ??
      (container.querySelector("li") as HTMLElement);

    expect(root).not.toBeNull();
    expect(root.className).toContain("hover:bg-cta-orange/80");
  });

  it("uses <span> as label when not button, not sidebar left menu, and no icon", async () => {
    const { container } = await renderMenuItem({
      isButton: false,
      isSidebarLeftMenu: false,
      iconName: undefined,
    });

    const spanLabel = container.querySelector("span");
    expect(spanLabel).not.toBeNull();
    expect(spanLabel?.textContent).toContain("Log out");
  });

  it("uses <p> label with padding when not button and icon is present (non-sidebar)", async () => {
    const { container } = await renderMenuItem({
      isButton: false,
      isSidebarLeftMenu: false,
      iconName: "user",
    });

    const pLabel = container.querySelector("p");
    expect(pLabel).not.toBeNull();
    expect(pLabel!.className).toContain("px-2");
  });

  it("applies sidebar layout classes when isSidebarLeftMenu = true", async () => {
    const { container } = await renderMenuItem({
      isButton: false,
      isSidebarLeftMenu: true,
      iconName: "user",
    });

    const root = container.querySelector("li") as HTMLElement;
    expect(root).not.toBeNull();
    expect(root.className).toContain("relative");
    expect(root.className).toContain("space-x-2");
  });
});
