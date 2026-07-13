// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardChangeAccountInfoPassword from "../../../../app/components/card/change-account-info/CardChangeAccountInfoPassword.vue";
import { getEnglishText } from "../../../../shared/utils/i18n";
import render from "../../../render";

describe("CardChangeAccountInfoPassword", () => {
  it("renders the header", async () => {
    await render(CardChangeAccountInfoPassword);

    expect(
      screen.getAllByText(
        getEnglishText(
          "i18n.components.card_change_account_info_password.header_cta"
        )
      ).length
    ).toBeGreaterThan(0);
  });

  it("renders the current password, new password, and confirm password fields", async () => {
    const { container } = await render(CardChangeAccountInfoPassword);

    expect(container.querySelector("#current-password")).toBeTruthy();
    expect(container.querySelector("#password")).toBeTruthy();
    expect(container.querySelector("#confirm-password")).toBeTruthy();
  });

  it("renders the CTA button", async () => {
    await render(CardChangeAccountInfoPassword);

    const button = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.card_change_account_info_password.cta_aria_label"
      ),
    });
    expect(button).toBeTruthy();
  });
});
