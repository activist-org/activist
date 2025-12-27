// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import FormTextInputPassword from "../../../../app/components/form/text/FormTextInputPassword.vue";
import { IconMap } from "../../../../shared/types/icon-map";
import { getEnglishText } from "../../../../shared/utils/i18n";
import render from "../../../../test/render";

// Note: Auto-import mocks (useI18n, etc.) are handled globally in test/setup.ts.

describe("FormTextInputPassword", () => {
  const defaultProps = {
    id: "test-password",
    label: "Password",
  };

  // MARK: Basic Rendering Tests

  it("renders with password input type by default", async () => {
    await render(FormTextInputPassword, {
      props: defaultProps,
    });

    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();
    expect(input.getAttribute("type")).toBe("password");
  });

  it("renders show password button", async () => {
    await render(FormTextInputPassword, {
      props: defaultProps,
    });

    const toggleButton = screen.getByTestId("test-password-show-password");
    expect(toggleButton).toBeTruthy();
    expect(toggleButton.getAttribute("type")).toBe("button");
  });

  // MARK: Toggle Functionality Tests

  it("toggles input type between password and text when button is clicked", async () => {
    await render(FormTextInputPassword, {
      props: defaultProps,
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const toggleButton = screen.getByTestId("test-password-show-password");

    expect(input.getAttribute("type")).toBe("password");

    await fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(input.getAttribute("type")).toBe("text");
    });

    await fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(input.getAttribute("type")).toBe("password");
    });

    await fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(input.getAttribute("type")).toBe("text");
    });
  });

  // MARK: Icon Tests

  it("displays visible icon when password is hidden", async () => {
    await render(FormTextInputPassword, {
      props: defaultProps,
      global: {
        stubs: {
          Icon: {
            props: ["name"],
            template: '<span :data-icon="name"></span>',
          },
        },
      },
    });

    const icon = screen
      .getByTestId("test-password-show-password")
      .querySelector("[data-icon]");
    expect(icon?.getAttribute("data-icon")).toBe(IconMap.VISIBLE);
  });

  it("displays hidden icon when password is visible", async () => {
    await render(FormTextInputPassword, {
      props: defaultProps,
      global: {
        stubs: {
          Icon: {
            props: ["name"],
            template: '<span :data-icon="name"></span>',
          },
        },
      },
    });

    const toggleButton = screen.getByTestId("test-password-show-password");

    let icon = toggleButton.querySelector("[data-icon]");
    expect(icon?.getAttribute("data-icon")).toBe(IconMap.VISIBLE);

    await fireEvent.click(toggleButton);

    await waitFor(() => {
      icon = toggleButton.querySelector("[data-icon]");
      expect(icon?.getAttribute("data-icon")).toBe(IconMap.HIDDEN);
    });
  });

  // MARK: Accessibility Tests

  it("updates aria-label when password visibility is toggled", async () => {
    await render(FormTextInputPassword, {
      props: defaultProps,
    });

    const toggleButton = screen.getByTestId("test-password-show-password");

    expect(toggleButton.getAttribute("aria-label")).toBe(
      getEnglishText(
        "i18n.components.form_text_input_password.show_password_aria_label"
      )
    );

    await fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(toggleButton.getAttribute("aria-label")).toBe(
        getEnglishText(
          "i18n.components.form_text_input_password.hide_password_aria_label"
        )
      );
    });

    await fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(toggleButton.getAttribute("aria-label")).toBe(
        getEnglishText(
          "i18n.components.form_text_input_password.show_password_aria_label"
        )
      );
    });
  });

  // MARK: Props Tests

  it("applies hasError prop to FormTextInput", async () => {
    // Style classes verified against frontend/app/assets/css/tailwind.css
    // border-action-red: error state border color
    await render(FormTextInputPassword, {
      props: {
        ...defaultProps,
        hasError: true,
      },
    });

    const border = screen.getByTestId("test-password-border");
    expect(border.className).toContain("border-action-red");
  });

  it("uses default hasError value of false when not provided", async () => {
    // Style classes verified against frontend/app/assets/css/tailwind.css
    // border-interactive: default border color
    await render(FormTextInputPassword, {
      props: defaultProps,
    });

    const border = screen.getByTestId("test-password-border");
    expect(border.className).toContain("border-interactive");
    expect(border.className).not.toContain("border-action-red");
  });

  it("generates correct button id based on component id", async () => {
    await render(FormTextInputPassword, {
      props: {
        id: "custom-password-input",
        label: "Password",
      },
    });

    const toggleButton = screen.getByTestId(
      "custom-password-input-show-password"
    );
    expect(toggleButton).toBeTruthy();
    expect(toggleButton.getAttribute("id")).toBe(
      "custom-password-input-show-password"
    );
  });

  it("renders with custom label", async () => {
    await render(FormTextInputPassword, {
      props: {
        id: "test-password",
        label: "Enter your password",
      },
    });

    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();
    expect(input.getAttribute("id")).toBe("test-password");
  });

  it("passes id prop to FormTextInput", async () => {
    await render(FormTextInputPassword, {
      props: defaultProps,
    });

    const input = screen.getByRole("textbox");
    expect(input.getAttribute("id")).toBe("test-password");
  });

  // MARK: Input Behavior Tests

  it("allows input of text when password is visible", async () => {
    await render(FormTextInputPassword, {
      props: defaultProps,
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const toggleButton = screen.getByTestId("test-password-show-password");

    await fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(input.getAttribute("type")).toBe("text");
    });

    expect(input).toBeTruthy();
    expect(input.getAttribute("type")).toBe("text");
    expect(input.getAttribute("role")).toBe("textbox");

    await fireEvent.update(input, "mySecretPassword");
    expect(input.value).toBe("mySecretPassword");
  });

  // MARK: modelValue Tests

  it("emits update:modelValue when input value changes", async () => {
    const { emitted } = await render(FormTextInputPassword, {
      props: defaultProps,
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;

    await fireEvent.update(input, "newPassword");

    expect(emitted("update:modelValue")).toBeTruthy();
    expect(emitted("update:modelValue")[0]).toEqual(["newPassword"]);
  });

  it("displays modelValue prop in input", async () => {
    await render(FormTextInputPassword, {
      props: {
        ...defaultProps,
        modelValue: "initialPassword",
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("initialPassword");
  });

  it("maintains input value when toggling visibility", async () => {
    await render(FormTextInputPassword, {
      props: {
        ...defaultProps,
        modelValue: "testPassword123",
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const toggleButton = screen.getByTestId("test-password-show-password");

    expect(input.getAttribute("type")).toBe("password");
    expect(input.value).toBe("testPassword123");

    await fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(input.getAttribute("type")).toBe("text");
    });
    expect(input.value).toBe("testPassword123");

    await fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(input.getAttribute("type")).toBe("password");
    });
    expect(input.value).toBe("testPassword123");
  });

  it("handles empty string modelValue", async () => {
    await render(FormTextInputPassword, {
      props: {
        ...defaultProps,
        modelValue: "",
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("handles undefined modelValue", async () => {
    await render(FormTextInputPassword, {
      props: defaultProps,
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;
    // Default value from withDefaults is "".
    expect(input.value).toBe("");
  });

  // MARK: Style Coverage Tests

  it("shrinks label when input is focused", async () => {
    // Style classes verified against frontend/app/assets/css/tailwind.css.
    // Label shrinking behavior inherited from FormTextInput component.
    await render(FormTextInputPassword, {
      props: defaultProps,
    });

    const input = screen.getByRole("textbox");
    const border = screen.getByTestId("test-password-border");
    const container = border.closest(".border-box");
    const label = container?.parentElement?.querySelector("label");

    expect(label?.className).toMatch(/translate-y-\[0\.6rem\]/);

    await fireEvent.focus(input);

    await waitFor(() => {
      const updatedLabel = container?.parentElement?.querySelector("label");
      expect(updatedLabel?.className).toMatch(/translate-x-4/);
      expect(updatedLabel?.className).toMatch(/text-sm/);
    });
  });

  it("expands label when input is empty and blurred", async () => {
    // Style classes verified against frontend/app/assets/css/tailwind.css.
    // Label expanding behavior inherited from FormTextInput component.
    await render(FormTextInputPassword, {
      props: defaultProps,
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const border = screen.getByTestId("test-password-border");
    const container = border.closest(".border-box");

    await fireEvent.focus(input);
    await fireEvent.update(input, "test");
    await fireEvent.blur(input);

    await waitFor(() => {
      const updatedLabel = container?.parentElement?.querySelector("label");
      expect(updatedLabel?.className).toMatch(/translate-x-4/);
    });

    await fireEvent.focus(input);
    await fireEvent.update(input, "");
    await fireEvent.blur(input);

    await waitFor(() => {
      const updatedLabel = container?.parentElement?.querySelector("label");
      expect(updatedLabel?.className).toMatch(/translate-y-\[0\.6rem\]/);
    });
  });

  // MARK: Edge Cases Tests

  it("handles icons slot content", async () => {
    await render(FormTextInputPassword, {
      props: defaultProps,
      slots: {
        icons: '<span data-testid="custom-icon">Custom Icon</span>',
      },
    });

    const customIcon = screen.getByTestId("custom-icon");
    expect(customIcon).toBeTruthy();

    const toggleButton = screen.getByTestId("test-password-show-password");
    expect(toggleButton).toBeTruthy();
  });

  it("handles empty string id and label gracefully", async () => {
    // Edge case: Empty strings for required props.
    // Component should still render, though this is not recommended usage.
    await render(FormTextInputPassword, {
      props: {
        id: "",
        label: "",
      },
    });

    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();
    expect(input.getAttribute("id")).toBe("");
  });

  it("handles very long password values", async () => {
    // Edge case: Very long password strings.
    const longPassword = "a".repeat(1000);
    await render(FormTextInputPassword, {
      props: {
        ...defaultProps,
        modelValue: longPassword,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe(longPassword);
    expect(input.value.length).toBe(1000);
  });

  it("handles special characters in password", async () => {
    // Edge case: Special characters in password.
    const specialPassword = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    await render(FormTextInputPassword, {
      props: {
        ...defaultProps,
        modelValue: specialPassword,
      },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe(specialPassword);
  });
});
