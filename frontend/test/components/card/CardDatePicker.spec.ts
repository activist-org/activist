// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardDatePicker from "../../../app/components/card/CardDatePicker.vue";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../render";

describe("CardDatePicker", () => {
  it("renders the date heading", async () => {
    await render(CardDatePicker);

    expect(
      screen.getByText(
        `${getEnglishText("i18n.components.card_date_picker.date")} *`
      )
    ).toBeTruthy();
  });

  it("renders the all day and multiple days checkboxes", async () => {
    const { container } = await render(CardDatePicker);

    expect(
      screen.getByText(
        getEnglishText("i18n.components.card_date_picker.all_day")
      )
    ).toBeTruthy();
    expect(
      screen.getByText(
        getEnglishText("i18n.components.card_date_picker.multiple_days")
      )
    ).toBeTruthy();

    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(2);
  });

  it("renders the time and expanded calendar pickers", async () => {
    const { container } = await render(CardDatePicker);

    // Two time-mode pickers plus one expanded calendar picker.
    const calendars = container.querySelectorAll(".vc-container");
    expect(calendars.length).toBe(3);
  });

  it("applies dark mode class by default", async () => {
    const { container } = await render(CardDatePicker);

    const calendars = container.querySelectorAll(".vc-container");
    calendars.forEach((calendar) => {
      expect(calendar.classList.contains("vc-dark")).toBe(true);
    });
  });
});
