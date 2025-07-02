// SPDX-License-Identifier: AGPL-3.0-or-later
import SignUp from "@/pages/auth/sign-up.vue";
import render from "@/test/render";
import { fireEvent, screen, waitFor, within } from "@testing-library/vue";

import {
  PASSWORD_STRENGTH_COLOR as COLOR,
  PASSWORD_RATING as RATING,
} from "~/test-utils/constants";

describe("sign-up", () => {
  // it("shows error border on blur when password invalid", async () => {
  //   await render(SignUp);

  //   const inputBorder = screen.getByTestId("sign-up-password-border");
  //   expect(inputBorder.className).toMatch("border-interactive");

  //   const passwordInput = screen.getByLabelText(
  //     getEnglishText("i18n._global.enter_password")
  //   );
  //   await fireEvent.update(passwordInput, "a");
  //   await fireEvent.blur(passwordInput);

  //   await waitFor(() => {
  //     expect(screen.getByTestId("sign-up-password-border").className).toMatch(
  //       "border-action-red dark:border-action-red"
  //     );
  //   });
  // });

  // it("shows green check when passwords match", async () => {
  //   await render(SignUp);

  //   const passwordInput = screen.getByLabelText(
  //     getEnglishText("i18n._global.enter_password")
  //   );

  //   await fireEvent.update(passwordInput, "abcd");
  //   await fireEvent.blur(passwordInput);

  //   const repeatPasswordInput = screen.getByLabelText(
  //     getEnglishText("i18n._global.repeat_password")
  //   );

  //   await fireEvent.update(repeatPasswordInput, "ab");

  //   let icon = await screen.findByRole("img", {
  //     name: getEnglishText("i18n.pages.auth._global.passwords_do_not_match"),
  //   });
  //   expect(icon.style.color).toBe("#BA3D3B");

  //   await fireEvent.update(repeatPasswordInput, "abcd");

  //   await waitFor(() => {
  //     icon = screen.getByRole("img", {
  //       name: getEnglishText("i18n.pages.auth._global.passwords_match"),
  //     });
  //     expect(icon.style.color).toBe("#3BA55C");
  //   });
  // });

  it.each([
    ["a", RATING.VERY_WEAK],
    ["Activis", RATING.WEAK],
    ["Activist4Climat", RATING.MEDIUM],
    ["Activist4ClimateChange", RATING.STRONG],
    ["Activist4ClimateChange!", RATING.VERY_STRONG],
  ])("shows password %s has rating of %s", async (password, ratingText) => {
    await render(SignUp);

    const passwordInput = screen.getByLabelText(
      getEnglishText("i18n._global.enter_password")
    );

    await fireEvent.update(passwordInput, password);

    await waitFor(() => {
      const rating = screen.getByTestId("sign-in-password-strength-text");
      expect(rating.textContent).toContain(ratingText);
    });
  });

  it.each([
    [
      "a",
      "20%",
      (progressBar: HTMLElement) =>
        expect(progressBar.className).toMatch(COLOR.RED),
    ],
    [
      "Activis",
      "40%",
      (progressBar: HTMLElement) =>
        expect(progressBar.className).toMatch(COLOR.ORANGE),
    ],
    [
      "Activist4Climat",
      "60%",
      (progressBar: HTMLElement) =>
        expect(progressBar.className).toMatch(COLOR.YELLOW),
    ],
    [
      "Activist4ClimateChange",
      "80%",
      (progressBar: HTMLElement) =>
        expect(progressBar.className).toMatch(COLOR.GREEN),
    ],
    [
      "Activist4ClimateChange!",
      "100%",
      (progressBar: HTMLElement) =>
        expect(progressBar.classList).not.toContain("bg"),
    ],
  ])(
    "shows password %s has progress of %s",
    async (password, progress, expectColor) => {
      await render(SignUp);

      const passwordInput = screen.getByLabelText(
        getEnglishText("i18n._global.enter_password")
      );

      await fireEvent.update(passwordInput, password);

      await waitFor(() => {
        const progressBar = screen.getByTestId(
          "password-strength-indicator-progress"
        );
        expect(progressBar.style.width).toBe(progress);
        expectColor(progressBar);
      });
    }
  );

  it.each([
    [
      "a",
      [
        { rule: "capital-letters", passed: false },
        { rule: "contains-numbers", passed: false },
        { rule: "contains-special-chars", passed: false },
        { rule: "lower-case-letters", passed: true },
        { rule: "number-of-chars", passed: false },
      ],
    ],
    [
      "ABCEDFGHIJK",
      [
        { rule: "capital-letters", passed: true },
        { rule: "contains-numbers", passed: false },
        { rule: "contains-special-chars", passed: false },
        { rule: "lower-case-letters", passed: false },
        { rule: "number-of-chars", passed: false },
      ],
    ],
    [
      "#$%",
      [
        { rule: "capital-letters", passed: false },
        { rule: "contains-numbers", passed: false },
        { rule: "contains-special-chars", passed: true },
        { rule: "lower-case-letters", passed: false },
        { rule: "number-of-chars", passed: false },
      ],
    ],
    [
      "012345678912",
      [
        { rule: "capital-letters", passed: false },
        { rule: "contains-numbers", passed: true },
        { rule: "contains-special-chars", passed: false },
        { rule: "lower-case-letters", passed: false },
        { rule: "number-of-chars", passed: true },
      ],
    ],
  ])("shows rule violations for password: %s", async (password, rules) => {
    await render(SignUp);

    const passwordInput = screen.getByLabelText(
      getEnglishText("i18n._global.enter_password")
    );

    await fireEvent.update(passwordInput, password);
    await fireEvent.focus(passwordInput);

    await screen.findByText(
      getEnglishText(
        "i18n.components.tooltip_password_requirements.password_rules_message"
      )
    );

    for (const { rule, passed } of rules) {
      const line = screen.getByTestId(rule);

      const icon = await within(line).findByRole("img", {
        name: passed
          ? getEnglishText(
              "i18n.components.tooltip_password_requirements.password_passed_rule"
            )
          : getEnglishText(
              "i18n.components.tooltip_password_requirements.password_failed_rule"
            ),
      });

      expect(icon.style.color).toBe(passed ? "#198754" : "#BA3D3B");
    }
  });
});
