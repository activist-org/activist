// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it } from "vitest";

/**
 * NOTE: Password strength and validation flows are currently covered by
 * Playwright E2E tests (see frontend/test-e2e/specs/all/authentication).
 * These Vitest tests are intentionally left as TODOs until we have a clear
 * unit-testing strategy for the set-password page.
 */
describe("set-password", () => {
  it.todo("shows validation errors and visual feedback for weak passwords");
  it.todo("indicates when the repeated password matches the original");
  it.todo("shows rule violations for different password patterns");
});

// ---------------------------------------------------------------------------
// Attn: Legacy Vitest implementation (kept for reference only).
// These tests were written before @sidebase/nuxt-auth and the current
// Playwright-based auth flows. When re-implementing unit tests, use this
// block as a reference, but prefer the newer mocking patterns and helpers.
// ---------------------------------------------------------------------------

// import SetPassword from "@/pages/auth/set-password.vue";
// import render from "@/test/render";
// import { fireEvent, screen, waitFor, within } from "@testing-library/vue";

// import {
//   PASSWORD_STRENGTH_COLOR as COLOR,
//   PASSWORD_RATING as RATING,
// } from "../../constants";

// describe("reset-password", () => {
//   it("shows error border on blur when password invalid", async () => {
//     await render(SetPassword);

//     const inputBorder = screen.getByTestId("set-password-password-border");
//     expect(inputBorder.className).toMatch("border-interactive");

//     const passwordInput = screen.getByLabelText(
//       getEnglishText("i18n._global.enter_password")
//     );
//     await fireEvent.update(passwordInput, "a");
//     await fireEvent.blur(passwordInput);

//     await waitFor(() => {
//       expect(
//         screen.getByTestId("set-password-password-border").className
//       ).toMatch("border-action-red dark:border-action-red");
//     });
//   });

//   it("shows green check when passwords match", async () => {
//     await render(SetPassword);

//     const passwordInput = screen.getByLabelText(
//       getEnglishText("i18n._global.enter_password")
//     );

//     await fireEvent.update(passwordInput, "abcd");
//     await fireEvent.blur(passwordInput);

//     const repeatPasswordInput = screen.getByLabelText(
//       getEnglishText("i18n._global.repeat_password")
//     );

//     await fireEvent.update(repeatPasswordInput, "ab");

//     let icon = await screen.findByRole("img", {
//       name: getEnglishText("i18n.pages.auth._global.passwords_do_not_match"),
//     });
//     expect(icon.style.color).toBe("#BA3D3B");

//     await fireEvent.update(repeatPasswordInput, "abcd");

//     await waitFor(() => {
//       icon = screen.getByRole("img", {
//         name: getEnglishText("i18n.pages.auth._global.passwords_match"),
//       });
//       expect(icon.style.color).toBe("#3BA55C");
//     });
//   });

//   it.each([
//     ["a", RATING.VERY_WEAK],
//     ["Activis", RATING.WEAK],
//     ["Activist4Climat", RATING.MEDIUM],
//     ["Activist4ClimateChange", RATING.STRONG],
//     ["Activist4ClimateChange!", RATING.VERY_STRONG],
//   ])("shows password %s has rating of %s", async (password, ratingText) => {
//     await render(SetPassword);

//     const passwordInput = screen.getByLabelText(
//       getEnglishText("i18n._global.enter_password")
//     );

//     await fireEvent.update(passwordInput, password);

//     await waitFor(() => {
//       const rating = screen.getByTestId("sign-in-password-strength-text");
//       expect(rating.textContent).toContain(ratingText);
//     });
//   });

//   it.each([
//     [
//       "a",
//       "20%",
//       (progressBar: HTMLElement) =>
//         expect(progressBar.className).toMatch(COLOR.RED),
//     ],
//     [
//       "Activis",
//       "40%",
//       (progressBar: HTMLElement) =>
//         expect(progressBar.className).toMatch(COLOR.ORANGE),
//     ],
//     [
//       "Activist4Climat",
//       "60%",
//       (progressBar: HTMLElement) =>
//         expect(progressBar.className).toMatch(COLOR.YELLOW),
//     ],
//     [
//       "Activist4ClimateChange",
//       "80%",
//       (progressBar: HTMLElement) =>
//         expect(progressBar.className).toMatch(COLOR.GREEN),
//     ],
//     [
//       "Activist4ClimateChange!",
//       "100%",
//       (progressBar: HTMLElement) =>
//         expect(progressBar.classList).not.toContain("bg"),
//     ],
//   ])(
//     "shows password %s has progress of %s",
//     async (password, progress, expectColor) => {
//       await render(SetPassword);

//       const passwordInput = screen.getByLabelText(
//         getEnglishText("i18n._global.enter_password")
//       );

//       await fireEvent.update(passwordInput, password);

//       await waitFor(() => {
//         const progressBar = screen.getByTestId(
//           "password-strength-indicator-progress"
//         );
//         expect(progressBar.style.width).toBe(progress);
//         expectColor(progressBar);
//       });
//     }
//   );

//   it.each([
//     [
//       "a",
//       [
//         { rule: "capital-letters", passed: false },
//         { rule: "contains-numbers", passed: false },
//         { rule: "contains-special-chars", passed: false },
//         { rule: "lower-case-letters", passed: true },
//         { rule: "number-of-chars", passed: false },
//       ],
//     ],
//     [
//       "ABCEDFGHIJK",
//       [
//         { rule: "capital-letters", passed: true },
//         { rule: "contains-numbers", passed: false },
//         { rule: "contains-special-chars", passed: false },
//         { rule: "lower-case-letters", passed: false },
//         { rule: "number-of-chars", passed: false },
//       ],
//     ],
//     [
//       "#$%",
//       [
//         { rule: "capital-letters", passed: false },
//         { rule: "contains-numbers", passed: false },
//         { rule: "contains-special-chars", passed: true },
//         { rule: "lower-case-letters", passed: false },
//         { rule: "number-of-chars", passed: false },
//       ],
//     ],
//     [
//       "012345678912",
//       [
//         { rule: "capital-letters", passed: false },
//         { rule: "contains-numbers", passed: true },
//         { rule: "contains-special-chars", passed: false },
//         { rule: "lower-case-letters", passed: false },
//         { rule: "number-of-chars", passed: true },
//       ],
//     ],
//   ])("shows rule violations for password: %s", async (password, rules) => {
//     await render(SetPassword);

//     const passwordInput = screen.getByLabelText(
//       getEnglishText("i18n._global.enter_password")
//     );

//     await fireEvent.update(passwordInput, password);
//     await fireEvent.focus(passwordInput);

//     await screen.findByText(
//       getEnglishText(
//         "i18n.components.tooltip_password_requirements.password_rules_message"
//       )
//     );

//     for (const { rule, passed } of rules) {
//       const line = screen.getByTestId(rule);

//       const icon = await within(line).findByRole("img", {
//         name: passed
//           ? getEnglishText(
//               "i18n.components.tooltip_password_requirements.password_passed_rule"
//             )
//           : getEnglishText(
//               "i18n.components.tooltip_password_requirements.password_failed_rule"
//             ),
//       });

//       expect(icon.style.color).toBe(passed ? "#198754" : "#BA3D3B");
//     }
//   });
// });
