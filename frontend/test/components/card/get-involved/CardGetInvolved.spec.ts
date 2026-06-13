// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardGetInvolved from "../../../../app/components/card/get-involved/CardGetInvolved.vue";
import render from "../../../render";

describe("CardGetInvolved", () => {
  it("renders the card wrapper", async () => {
    await render(CardGetInvolved);

    expect(screen.getByTestId("card-get-involved")).toBeTruthy();
  });

  it("renders slotted content", async () => {
    await render(CardGetInvolved, {
      slots: { default: "<p>Slot content</p>" },
    });

    expect(screen.getByText("Slot content")).toBeTruthy();
  });
});
