// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardDangerZone from "../../../app/components/card/CardDangerZone.vue";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../render";

const defaultProps = {
  description: "This action cannot be undone.",
  ctaBtnText: "Delete account",
  ctaBtnAriaLabel: "Delete your account",
};

describe("CardDangerZone", () => {
  it("renders the header", async () => {
    await render(CardDangerZone, { props: defaultProps });

    expect(
      screen.getByText(
        getEnglishText("i18n.components.card_danger_zone.header")
      )
    ).toBeTruthy();
  });

  it("renders the description prop", async () => {
    await render(CardDangerZone, { props: defaultProps });

    expect(screen.getByText(defaultProps.description)).toBeTruthy();
  });

  it("renders username and password fields", async () => {
    const { container } = await render(CardDangerZone, {
      props: defaultProps,
    });

    const usernameLabel = getEnglishText(
      "i18n.components.card_danger_zone.username_label"
    );
    const passwordLabel = getEnglishText(
      "i18n.components.card_danger_zone.password_label"
    );
    expect(
      screen.getByText((text) => text.startsWith(usernameLabel))
    ).toBeTruthy();
    expect(
      screen.getByText((text) => text.startsWith(passwordLabel))
    ).toBeTruthy();

    const usernameInput = container.querySelector("#username");
    const passwordInput = container.querySelector("#password");
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(passwordInput?.getAttribute("type")).toBe("password");
  });

  it("renders the CTA button with the provided text and aria-label", async () => {
    await render(CardDangerZone, { props: defaultProps });

    const button = screen.getByRole("button", {
      name: defaultProps.ctaBtnAriaLabel,
    });
    expect(button).toBeTruthy();
    expect(button.textContent).toContain(defaultProps.ctaBtnText);
  });
});
