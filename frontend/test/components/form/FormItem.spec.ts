// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import FormTemplate from "~/components/form/FormTemplate.vue";
import { getEnglishText } from "~/utils/i18n";

import render from "../../render";

describe("FormItem component", () => {
  // MARK: Label Rendering

  it("renders label when label prop is provided", async () => {
    await render(FormTemplate);

    // FormLabel renders with specific class.
    const nameLabel = document.querySelector(
      'label.text-base.font-semibold[for="form-item-name"]'
    );
    expect(nameLabel).toBeTruthy();
    expect(nameLabel?.textContent).toContain("Name");
  });

  it("shows required indicator for required fields", async () => {
    await render(FormTemplate);

    // Required indicator is an asterisk.
    const requiredIndicators = screen.getAllByText("*");
    expect(requiredIndicators.length).toBeGreaterThan(0);
  });

  // MARK: ID Generation

  it("generates default ID from field name", async () => {
    await render(FormTemplate);

    const nameInput = screen.getByLabelText("Name");
    expect(nameInput.id).toBe("form-item-name");
  });

  // MARK: Error Message Display

  it("shows error message when field validation fails", async () => {
    await render(FormTemplate);

    const submitBtn = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });

    await fireEvent.click(submitBtn);

    const nameError = await screen.findByTestId("form-item-name-error");
    expect(nameError.textContent).toBe("Required");
  });

  it("clears error message when field becomes valid", async () => {
    await render(FormTemplate);

    const submitBtn = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });

    await fireEvent.click(submitBtn);

    // Wait for error to appear.
    await screen.findByTestId("form-item-name-error");

    // Fix the error.
    const nameInput = screen.getByLabelText("Name");
    await fireEvent.update(nameInput, "Valid Name");

    // Error should clear.
    await waitFor(() => {
      expect(screen.queryByTestId("form-item-name-error")).toBeNull();
    });
  });

  // MARK: Slot Functionality

  it("passes field bindings to slot content", async () => {
    await render(FormTemplate);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");

    // Inputs should be rendered via slot.
    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
  });

  // MARK: Style Tests

  it("applies custom classItem prop", async () => {
    await render(FormTemplate);

    // Check that FormItem containers have flex flex-col classes.
    const containers = document.querySelectorAll(".flex.flex-col");
    expect(containers.length).toBeGreaterThan(0);
  });

  // MARK: Accessibility Tests

  it("associates label with input via for attribute", async () => {
    await render(FormTemplate);

    const nameLabel = document.querySelector(
      'label.text-base.font-semibold[for="form-item-name"]'
    );
    const nameInput = screen.getByLabelText("Name");

    expect(nameLabel?.getAttribute("for")).toBe(nameInput.id);
  });

  it("formats error message ID correctly", async () => {
    await render(FormTemplate);

    const submitBtn = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });

    await fireEvent.click(submitBtn);

    const nameError = await screen.findByTestId("form-item-name-error");
    expect(nameError.id).toBe("form-item-name-error");
  });

  // MARK: Edge Cases

  it("handles nested field names with dots", async () => {
    await render(FormTemplate);

    // Add a family member to test nested field names.
    const addMemberBtn = screen.getByRole("button", {
      name: "family-member-add-aria-label",
    });
    await fireEvent.click(addMemberBtn);

    const submitBtn = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });

    await fireEvent.click(submitBtn);

    // Check nested field error.
    const familyMemberError = await screen.findByTestId(
      "form-item-familyMembers.0.name-error"
    );
    expect(familyMemberError).toBeTruthy();
  });

  it("does not show error for optional fields", async () => {
    await render(FormTemplate);

    const submitBtn = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });

    await fireEvent.click(submitBtn);

    // Family members is optional initially.
    expect(
      screen.queryByTestId("form-item-familyMembers.0.name-error")
    ).toBeNull();
  });

  it("handles multiple validation errors on same field", async () => {
    await render(FormTemplate);

    const emailInput = screen.getByLabelText("Email");

    // Enter invalid email.
    await fireEvent.update(emailInput, "invalid");
    await fireEvent.blur(emailInput);

    const emailError = await screen.findByTestId("form-item-email-error");
    expect(emailError).toBeTruthy();

    // Fix with valid email.
    await fireEvent.update(emailInput, "valid@example.com");
    await fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.queryByTestId("form-item-email-error")).toBeNull();
    });
  });
});
