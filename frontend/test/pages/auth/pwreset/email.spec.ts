// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import PwresetEmail from "../../../../app/pages/auth/pwreset/email.vue";
import { getEnglishText } from "../../../../shared/utils/i18n";
import render from "../../../render";
import { createUseRouterMock } from "../../../mocks/composableMocks";

// Provide a router stub so the submit handler can call useRouter().push without throwing.
globalThis.useRouter = createUseRouterMock();

describe("pwreset/email", () => {
  it("renders the page title", async () => {
    await render(PwresetEmail);

    expect(
      screen.getByText(getEnglishText("i18n.pages.auth.pwreset.email.title"))
    ).toBeTruthy();
  });

  it("renders the email input with an interactive border", async () => {
    await render(PwresetEmail);

    const border = screen.getByTestId("form-item-email-border");
    expect(border.className).toMatch("border-interactive");
  });

  it("shows error border when submitted with no email", async () => {
    await render(PwresetEmail);

    const submitButton = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByTestId("form-item-email-border").className
      ).toMatch("border-action-red dark:border-action-red");
    });
  });

  it("shows error border when submitted with an invalid email format", async () => {
    await render(PwresetEmail);

    const emailInput = screen.getByLabelText(
      getEnglishText("i18n.pages.auth._global.enter_email")
    );
    await fireEvent.update(emailInput, "not-an-email");

    const submitButton = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByTestId("form-item-email-border").className
      ).toMatch("border-action-red dark:border-action-red");
    });
  });

  it("shows an error message for an invalid email format", async () => {
    await render(PwresetEmail);

    const emailInput = screen.getByLabelText(
      getEnglishText("i18n.pages.auth._global.enter_email")
    );
    await fireEvent.update(emailInput, "not-an-email");

    const submitButton = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });
    await fireEvent.click(submitButton);

    // The FormErrorMessage renders the raw i18n key as its text content.
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
      expect(screen.getByTestId("form-item-email-error").textContent).toContain(
        "i18n.pages.auth._global.invalid_email"
      );
    });
  });

  it.todo("navigates to home on successful password reset email submission");
  it.todo("shows an error when the password reset email request fails");
});
