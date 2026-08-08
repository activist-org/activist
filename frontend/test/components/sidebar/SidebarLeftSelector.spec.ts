// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import SidebarLeftSelector from "../../../app/components/sidebar/left/SidebarLeftSelector.vue";
import render from "../../../test/render";
import { createUseLocalePathMock } from "../../mocks/composableMocks";

globalThis.useLocalePath = createUseLocalePathMock("");

const baseProps = {
  label: "i18n._global.about",
  routeUrl: "/",
  selected: false,
};

const renderSelector = (iconUrl: string) =>
  render(SidebarLeftSelector, {
    props: { ...baseProps, iconUrl },
  });

describe("SidebarLeftSelector", () => {
  it.each([
    ["Bootstrap", "bi:card-text"],
    ["custom", "IconGroup"],
  ])("uses fixed dimensions for %s icons", async (_type, iconUrl) => {
    await renderSelector(iconUrl);

    const icon = screen.getByRole("img", { name: iconUrl });
    expect([...icon.classList]).toEqual(
      expect.arrayContaining(["block!", "h-5!", "w-5!"])
    );
    expect(icon.classList).not.toContain("scale-125");
  });
});
