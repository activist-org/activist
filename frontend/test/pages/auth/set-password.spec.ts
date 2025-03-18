// SPDX-License-Identifier: AGPL-3.0-or-later
import SetPassword from "@/pages/auth/set-password.vue";
import render from "@/test/render";
import { fireEvent, screen, waitFor, within } from "@testing-library/vue";

describe("reset-password", () => {
  it("shows error border on blur when password invalid", async () => {
    await render(SetPassword);

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    expect(passwordInput.parentElement!.className).toContain(
      "border-interactive"
    );

    await fireEvent.update(passwordInput, "a");
    await fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByTestId(/enter your password/i).parentElement!.className
      ).toContain("border-action-red dark:border-action-red");
    });
  });

  it("shows green check when passwords match", async () => {
    await render(SetPassword);

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    await fireEvent.update(passwordInput, "abcd");
    await fireEvent.blur(passwordInput);

    const repeatPasswordInput = screen.getByPlaceholderText(/repeat password/i);

    await fireEvent.update(repeatPasswordInput, "ab");

    let icon = await screen.findByTestId("extra-icon");
    expect(icon.style.color).toBe("#BA3D3B");

    await fireEvent.update(repeatPasswordInput, "abcd");

    await waitFor(() => {
      icon = screen.getByTestId("extra-icon");
      expect(icon.style.color).toBe("#3BA55C");
    });
  });

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
    await render(SetPassword);

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    await fireEvent.update(passwordInput, password);
    await screen.findByText(/for your security/i);

    for (const { rule, passed } of rules) {
      const line = screen.getByTestId(rule);

      const icon = await within(line).findByRole("img", {
        name: passed ? "passed" : "failed",
      });

      expect(icon.style.color).toBe(passed ? "#198754" : "#BA3D3B");
    }
  });
});
