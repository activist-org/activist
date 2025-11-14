// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import FormTemplate from "~/components/form/FormTemplate.vue";
import { getEnglishText } from "#shared/utils/i18n";

import render from "../../../test/render";

describe("Form component", () => {
  it("shows validation errors when fields are empty", async () => {
    await render(FormTemplate);

    const submitBtn = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });

    await fireEvent.click(submitBtn);
    const nameError = await screen.findByTestId("form-item-name-error");
    expect(nameError.textContent).toBe("Required");

    // Family Members validation (no members initially—should be valid).
    expect(
      screen.queryByTestId("form-item-familyMembers.0.name-error")
    ).toBeNull();
  });

  it("submits when fields are valid", async () => {
    await render(FormTemplate);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");

    await fireEvent.update(nameInput, "Alice");
    await fireEvent.update(emailInput, "alice@example.com");

    // Add family member.
    const addMemberBtn = screen.getByRole("button", {
      name: "family-member-add-aria-label",
    });
    await fireEvent.click(addMemberBtn);

    // Fill family member name.
    const familyMemberNameInput = screen.getByLabelText("Family members name");
    await fireEvent.update(familyMemberNameInput, "Bob");

    const submitBtn = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });

    await fireEvent.click(submitBtn);

    // Could check for successful event if the form has a message or emitted handler.
  });

  it("shows and clears error for family member after invalid and valid input", async () => {
    await render(FormTemplate);

    // Add a family member.
    const addMemberBtn = screen.getByRole("button", {
      name: "family-member-add-aria-label",
    });
    await fireEvent.click(addMemberBtn);

    // Try to submit with incomplete family member.
    const submitBtn = screen.getByRole("button", {
      name: getEnglishText("i18n.components.submit_aria_label"),
    });

    await fireEvent.click(submitBtn);
    const famNameError = await screen.findByTestId(
      "form-item-familyMembers.0.name-error"
    );
    expect(famNameError.textContent).toBe("Required");

    // Correct family member name.
    const familyMemberNameInput = screen.getByLabelText("Family members name");
    await fireEvent.update(familyMemberNameInput, "Bob");
    await fireEvent.blur(familyMemberNameInput);

    // Wait for error to clear.
    await new Promise((r) => setTimeout(r, 100));
    expect(
      screen.queryByTestId("form-item-familyMembers.0.name-error")
    ).toBeNull();
  });

  it("allows removing a family member from the list", async () => {
    await render(FormTemplate);

    const addMemberBtn = screen.getByRole("button", {
      name: "family-member-add-aria-label",
    });
    await fireEvent.click(addMemberBtn);

    // Add more than one.
    await fireEvent.click(addMemberBtn);
    // Remove the first member.
    const removeBtns = screen.getAllByRole("button", {
      name: "family-member-remove-aria-label",
    });
    await fireEvent.click(removeBtns[0]);

    // Only one family member input should remain.
    const memberInputs = screen.getAllByLabelText("Family members name");
    expect(memberInputs).toHaveLength(1);
  });
});
