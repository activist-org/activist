// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardMetric from "../../../app/components/card/CardMetric.vue";
import render from "../../render";

const defaultProps = {
  text: "Members",
  number: 42,
  textColor: "text-primary-text",
  borderColor: "border-action-red",
  backgroundColor: "bg-action-red/10",
};

describe("CardMetric", () => {
  it("renders the number and text", async () => {
    await render(CardMetric, { props: defaultProps });

    expect(screen.getByText("42")).toBeTruthy();
    expect(screen.getByText("Members")).toBeTruthy();
  });

  it("applies the color classes", async () => {
    const { container } = await render(CardMetric, { props: defaultProps });

    const card = container.querySelector(".card-style");
    expect(card?.classList.contains("text-primary-text")).toBe(true);
    expect(card?.classList.contains("border-action-red")).toBe(true);
    expect(card?.classList.contains("bg-action-red/10")).toBe(true);
  });
});
