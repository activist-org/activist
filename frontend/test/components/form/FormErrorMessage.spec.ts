// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import FormErrorMessage from "../../../app/components/form/FormErrorMessage.vue";
import render from "../../../test/render";

/**
 * Tests for the FormErrorMessage component.
 * Covers logic, props, styling, accessibility, and edge cases.
 * @see FormErrorMessage.vue
 */
describe("FormErrorMessage Component", () => {
  // Logic & Props
  describe("Logic and Props", () => {
    it("renders the message text when the 'message' prop is provided", async () => {
      await render(FormErrorMessage, { props: { message: "Test Error" } });

      const element = screen.getByTestId("form-error");
      expect(element.textContent).toContain("Test Error");
    });

    it("does not render anything if the 'message' prop is empty or undefined", async () => {
      await render(FormErrorMessage, { props: { message: "" } });

      const element = screen.queryByTestId("form-error");
      expect(element).toBeNull();
    });

    it("uses the custom ID provided via props", async () => {
      const testId = "form-item-password-error";

      await render(FormErrorMessage, {
        props: {
          message: "Error",
          id: testId,
        },
      });

      const element = screen.getByText("Error");
      expect(element.getAttribute("id")).toBe(testId);
    });

    it("falls back to a default ID if no ID is provided", async () => {
      const testId = "form-error";

      await render(FormErrorMessage, { props: { message: "Error" } });

      const element = screen.getByText("Error");
      expect(element.getAttribute("id")).toBe(testId);
    });
  });

  // Styling (Tailwind)
  describe("Styling", () => {
    it("applies the correct CSS class for error styling", async () => {
      await render(FormErrorMessage, { props: { message: "Error" } });

      const element = screen.getByTestId("form-error");
      expect(element.classList).toContain("error-text");
    });
  });

  // Accessibility (A11y)
  describe.skip("Accessibility", () => {
    it("has the correct aria role for error messages", async () => {
      // To be implemented, missing aria role in component
    });

    it("uses aria-live to announce errors dynamically", async () => {
      // To be implemented, missing aria-live in component
    });
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("handles extremely long error messages gracefully", async () => {
      await render(FormErrorMessage, { props: { message: "A".repeat(250) } });
      const element = screen.getByTestId("form-error");
      expect(element.textContent).toBe("A".repeat(250));
    });
  });
});
