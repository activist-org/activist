// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardDonate from "../../../app/components/card/CardDonate.vue";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../render";

describe("CardDonate", () => {
  it("renders the header", async () => {
    await render(CardDonate, { props: { userIsAdmin: false } });

    expect(
      screen.getByRole("heading", {
        name: getEnglishText("i18n.components.card_donate.donate"),
      })
    ).toBeTruthy();
  });

  it("renders the template text when no donationPrompt is provided", async () => {
    await render(CardDonate, { props: { userIsAdmin: false } });

    expect(
      screen.getByText(
        getEnglishText("i18n.components.card_donate.template_text")
      )
    ).toBeTruthy();
  });

  it("renders the donationPrompt when provided", async () => {
    await render(CardDonate, {
      props: { userIsAdmin: false, donationPrompt: "Support our mission!" },
    });

    expect(screen.getByText("Support our mission!")).toBeTruthy();
    expect(
      screen.queryByText(
        getEnglishText("i18n.components.card_donate.template_text")
      )
    ).toBeNull();
  });

  it("renders the donate link", async () => {
    await render(CardDonate, { props: { userIsAdmin: false } });

    const link = screen.getByRole("link", {
      name: getEnglishText(
        "i18n.components.card_donate.go_to_donation_page_aria_label"
      ),
    });
    expect(link).toBeTruthy();
    expect(link.textContent).toContain(
      getEnglishText("i18n.components.card_donate.donate")
    );
  });

  it("does not render the edit toggle button for non-admins", async () => {
    await render(CardDonate, { props: { userIsAdmin: false } });

    expect(
      screen.queryByRole("button", {
        name: getEnglishText(
          "i18n.components.card_donate.edit_donation_info_alt_text"
        ),
      })
    ).toBeNull();
  });

  it("renders the edit toggle button for admins and toggles its label/icon on click", async () => {
    await render(CardDonate, { props: { userIsAdmin: true } });

    const editLabel = getEnglishText(
      "i18n.components.card_donate.edit_donation_info_alt_text"
    );
    const cancelLabel = getEnglishText(
      "i18n.components.card_donate.cancel_edit_donation_info_alt_text"
    );

    const button = screen.getByRole("button", { name: editLabel });
    expect(screen.getByRole("img", { name: "bi:pencil-square" })).toBeTruthy();

    await fireEvent.click(button);

    expect(screen.getByRole("button", { name: cancelLabel })).toBeTruthy();
    expect(screen.queryByRole("button", { name: editLabel })).toBeNull();
  });
});
