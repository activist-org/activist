// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import BtnRoadMap from "../../../app/components/btn/BtnRoadMap.vue";
import render from "../../render";

const stubs = {
  NuxtLink: {
    template:
      '<a :id="$attrs.id" :href="to" :aria-label="$attrs[\'aria-label\']"><slot /></a>',
    props: ["to"],
  },
};

describe("BtnRoadMap", () => {
  it("renders with the correct id", async () => {
    await render(BtnRoadMap, { global: { stubs } });

    expect(document.getElementById("btn-roadmap")).toBeTruthy();
  });

  it("links to the roadmap URL", async () => {
    await render(BtnRoadMap, { global: { stubs } });

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe(
      "https://docs.activist.org/activist/product/about/roadmap"
    );
  });
});
