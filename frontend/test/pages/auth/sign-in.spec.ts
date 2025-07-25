// // SPDX-License-Identifier: AGPL-3.0-or-later
// import SignIn from "@/pages/auth/sign-in.vue";
// import render from "@/test/render";
// import { registerEndpoint } from "@nuxt/test-utils/runtime";
// import { fireEvent, screen, waitFor } from "@testing-library/vue";
// import { createError } from "h3";

// const TOKEN = "8b27c52516b94f5bb58d8d137a5379ca";

// afterEach(() => {
//   localStorage.removeItem("accessToken");
//   vi.resetAllMocks();
// });

// const signInMock = vi.fn();
// registerEndpoint("http://localhost:8000/v1/auth/sign_in", {
//   method: "POST",
//   handler: signInMock,
// });
/**
 * *NOTE: This test is currently disabled because authentication is handled by @sidebase/nuxt-auth
 * * and I have moved parts of the test to playwright tests.
 * * This test will be re-enabled once I have a better understanding of how to test the authentication flow with @sidebase/nuxt-auth in vitest.
 */
describe("sign-in", () => {
  //   it("signs in user with form data", async () => {
  //     signInMock.mockImplementation(() => ({
  //       token: TOKEN,
  //       message: "User was logged in successfully.",
  //     }));

  //     await render(SignIn);

  //     const usernameInput = screen.getByLabelText(
  //       getEnglishText("i18n.pages.auth.sign_in.enter_user_name")
  //     );
  //     await fireEvent.update(usernameInput, "admin");

  //     const passwordInput = screen.getByLabelText(
  //       getEnglishText("i18n._global.enter_password")
  //     );
  //     await fireEvent.update(passwordInput, "password");

  //     const submitButton = screen.getByRole("button", {
  //       name: getEnglishText("i18n.components.submit_aria_label"),
  //     });

  //     await fireEvent.click(submitButton);

  //     await waitFor(() => {
  //       expect(window.location.href).toBe("http://localhost:3000/home");
  //     });

  //     expect(localStorage.getItem("accessToken")).toBe(TOKEN);
  //   });

  //   it("shows alert message when sign in fails", async () => {
  //     signInMock.mockImplementation(() => {
  //       throw createError({
  //         status: 400,
  //         statusMessage: "Bad Request",
  //       });
  //     });

  //     const alertSpy = vi.spyOn(window, "alert");

  //     await render(SignIn);

  //     const usernameInput = screen.getByLabelText(
  //       getEnglishText("i18n.pages.auth.sign_in.enter_user_name")
  //     );
  //     await fireEvent.update(usernameInput, "admin");

  //     const passwordInput = screen.getByLabelText(
  //       getEnglishText("i18n._global.enter_password")
  //     );
  //     await fireEvent.update(passwordInput, "password");

  //     const submitButton = screen.getByRole("button", {
  //       name: getEnglishText("i18n.components.submit_aria_label"),
  //     });
  //     await fireEvent.click(submitButton);

  //     await waitFor(() => {
  //       expect(alertSpy).toHaveBeenCalledWith("Invalid sign in credentials");
  //     });

  //     expect(localStorage.getItem("accessToken")).toBe("undefined");
  //   });
  it("true is true", () => {
    expect(true).toBe(true);
  });
});
