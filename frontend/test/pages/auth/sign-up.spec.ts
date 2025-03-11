// SPDX-License-Identifier: AGPL-3.0-or-later
import SignUp from "@/pages/auth/sign-up.vue";
import render from "@/test/render";
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { fakeWait } from "~/test/time";

describe("sign-up", () => {
  it("shows errors for one character password", async () => {
    await render(SignUp);

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    expect(passwordInput.parentElement!.className).toContain(
      "border-interactive"
    );

    await fakeWait(1001, async () => {
      await fireEvent.update(passwordInput, "a");
      await fireEvent.blur(passwordInput);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(/enter your password/i).parentElement!.className
      ).toContain("border-action-red dark:border-action-red");
    });
  });
});
