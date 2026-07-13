// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardChangeAccountInfoUsername from "../../../../app/components/card/change-account-info/CardChangeAccountInfoUsername.vue";
import { getEnglishText } from "../../../../shared/utils/i18n";
import render from "../../../render";

describe("CardChangeAccountInfoUsername", () => {
  it("renders the header", async () => {
    await render(CardChangeAccountInfoUsername);

    expect(
      screen.getAllByText(
        getEnglishText(
          "i18n.components.card_change_account_info_username.header_cta"
        )
      ).length
    ).toBeGreaterThan(0);
  });

  it("renders the new username and password fields", async () => {
    const { container } = await render(CardChangeAccountInfoUsername);

    expect(container.querySelector("#new-username")).toBeTruthy();
    expect(container.querySelector("#password")).toBeTruthy();
  });

  it("renders the CTA button", async () => {
    await render(CardChangeAccountInfoUsername);

    const button = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.card_change_account_info_username.cta_aria_label"
      ),
    });
    expect(button).toBeTruthy();
  });
});
