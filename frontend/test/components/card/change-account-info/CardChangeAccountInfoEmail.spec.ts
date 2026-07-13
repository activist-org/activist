// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardChangeAccountInfoEmail from "../../../../app/components/card/change-account-info/CardChangeAccountInfoEmail.vue";
import { getEnglishText } from "../../../../shared/utils/i18n";
import render from "../../../render";

describe("CardChangeAccountInfoEmail", () => {
  it("renders the header", async () => {
    await render(CardChangeAccountInfoEmail);

    expect(
      screen.getAllByText(
        getEnglishText(
          "i18n.components.card_change_account_info_email.header_cta"
        )
      ).length
    ).toBeGreaterThan(0);
  });

  it("renders the old email, new email, and password fields", async () => {
    const { container } = await render(CardChangeAccountInfoEmail);

    expect(container.querySelector("#old-email")).toBeTruthy();
    expect(container.querySelector("#new-email")).toBeTruthy();
    expect(container.querySelector("#password")).toBeTruthy();

    expect(
      container
        .querySelector("#old-email")
        ?.getAttribute("placeholder")
    ).toBe(
      getEnglishText(
        "i18n.components.card_change_account_info_email.enter_old_email"
      )
    );
  });

  it("renders the CTA button", async () => {
    await render(CardChangeAccountInfoEmail);

    const button = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.card_change_account_info_email.cta_aria_label"
      ),
    });
    expect(button).toBeTruthy();
  });
});
