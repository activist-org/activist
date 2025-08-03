// SPDX-License-Identifier: AGPL-3.0-or-later
import FormTemplate from "@/components/form/FormTemplate.vue";
import render from "@/test/render";
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

describe("Form component", () => {
  it("shows validation errors when fields are empty", async () => {
    await render(FormTemplate);

    const submitBtn = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });

    await fireEvent.click(submitBtn);
    const nameError = await screen.findByTestId("form-item-name-error");
    expect(nameError.textContent).toBe("Required");
  });

  it("submits when fields are valid", async () => {
    await render(FormTemplate);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");

    await fireEvent.update(nameInput, "Alice");
    await fireEvent.update(emailInput, "alice@example.com");

    const submitBtn = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });

    await fireEvent.click(submitBtn);
  });

  it("clears error after correcting invalid input", async () => {
    await render(FormTemplate);

    const emailInput = screen.getByLabelText("Email");

    await fireEvent.update(emailInput, "not-an-email");
    await fireEvent.blur(emailInput);

    expect(await screen.findByText("Invalid email address"));

    await fireEvent.update(emailInput, "test@example.com");
    await fireEvent.blur(emailInput);

    // Wait for validation to re-run.
    await new Promise((r) => setTimeout(r, 100));

    expect(screen.queryByText("Invalid email address"));
  });
});
