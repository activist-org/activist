// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardAbout from "../../../../app/components/card/about/CardAbout.vue";
import render from "../../../render";

describe("CardAbout", () => {
  it("renders the card wrapper", async () => {
    await render(CardAbout);

    expect(screen.getByTestId("card-about")).toBeTruthy();
  });

  it("renders slotted content", async () => {
    await render(CardAbout, {
      slots: { default: "<p>Slot content</p>" },
    });

    expect(screen.getByText("Slot content")).toBeTruthy();
  });
});
