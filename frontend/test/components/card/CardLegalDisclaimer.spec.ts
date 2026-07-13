// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardLegalDisclaimer from "../../../app/components/card/CardLegalDisclaimer.vue";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../render";

describe("CardLegalDisclaimer", () => {
  it("renders the header", async () => {
    await render(CardLegalDisclaimer, {
      props: { disclaimer: "Some legal text." },
    });

    expect(
      screen.getByText(
        getEnglishText("i18n.components.card_legal_disclaimer.header")
      )
    ).toBeTruthy();
  });

  it("hides the disclaimer text until expanded", async () => {
    await render(CardLegalDisclaimer, {
      props: { disclaimer: "Some legal text." },
    });

    expect(screen.queryByText("Some legal text.")).toBeNull();
    expect(screen.getByRole("img", { name: "bi:chevron-down" })).toBeTruthy();

    await fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Some legal text.")).toBeTruthy();
    expect(screen.getByRole("img", { name: "bi:chevron-up" })).toBeTruthy();
  });
});
