// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import ConfirmEmail from "../../../../app/pages/auth/confirm/email.vue";
import { getEnglishText } from "../../../../shared/utils/i18n";
import render from "../../../render";

describe("confirm/email", () => {
  it("renders the confirmation title", async () => {
    await render(ConfirmEmail);

    expect(
      screen.getByText(getEnglishText("i18n.pages.auth.confirm.email.title"))
    ).toBeTruthy();
  });

  it("renders the issues prompt text", async () => {
    await render(ConfirmEmail);

    expect(
      screen.getByText(
        getEnglishText("i18n.pages.auth.confirm.email.issues_prompt"),
        { exact: false }
      )
    ).toBeTruthy();
  });

  it("renders the Matrix support link with the correct href", async () => {
    await render(ConfirmEmail);

    const link = screen.getByRole("link", {
      name: /matrix:activist_community/i,
    });
    expect(link.getAttribute("href")).toBe(
      "https://matrix.to/#/#activist_community:matrix.org"
    );
  });
});
