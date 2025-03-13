// SPDX-License-Identifier: AGPL-3.0-or-later
import SignUp from "@/pages/auth/sign-up.vue";
import render from "@/test/render";
import { fireEvent, screen, waitFor, within } from "@testing-library/vue";

describe("sign-up", () => {
  it("shows errors for one character password", async () => {
    await render(SignUp);

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    await fireEvent.update(passwordInput, "a");
    await screen.findByText(/for your security/i);

    const line = screen.getByTestId("capital-letters");

    // Icons render delayed
    const icon = await within(line).findByRole("img", { name: "failed" });

    expect(icon.style.color).toBe("#BA3D3B");
  });

  it("shows error border on blur when password invalid", async () => {
    await render(SignUp);

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
});
