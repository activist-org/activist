// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import SidebarLeftSelector from "../../../app/components/sidebar/left/SidebarLeftSelector.vue";
import render from "../../../test/render";
import { createUseLocalePathMock } from "../../mocks/composableMocks";

globalThis.useLocalePath = createUseLocalePathMock();

const baseProps = {
  label: "i18n._global.about",
  routeUrl: "/organizations/1/about",
  selected: false,
};

const renderSelector = (iconUrl: string) =>
  render(SidebarLeftSelector, {
    props: { ...baseProps, iconUrl },
  });

describe("SidebarLeftSelector", () => {
  it("scales Bootstrap icons to match custom icons", async () => {
    await renderSelector("bi:card-text");

    const icon = screen.getByRole("img", { name: "bi:card-text" });
    expect(icon.classList).toContain("scale-125");
  });

  it("keeps custom icons at their native scale", async () => {
    await renderSelector("IconGroup");

    const icon = screen.getByRole("img", { name: "IconGroup" });
    expect(icon.classList).not.toContain("scale-125");
  });
});
