// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardChangeAccountInfo from "../../../../app/components/card/change-account-info/CardChangeAccountInfo.vue";
import render from "../../../render";

describe("CardChangeAccountInfo", () => {
  it("renders slotted content", async () => {
    await render(CardChangeAccountInfo, {
      props: { ctaLabel: "Save", ctaAriaLabel: "Save changes" },
      slots: { default: "<p>Form fields</p>" },
    });

    expect(screen.getByText("Form fields")).toBeTruthy();
  });

  it("renders the CTA button with the provided label and aria-label", async () => {
    await render(CardChangeAccountInfo, {
      props: { ctaLabel: "Save", ctaAriaLabel: "Save changes" },
    });

    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toBeTruthy();
    expect(button.textContent).toContain("Save");
  });
});
