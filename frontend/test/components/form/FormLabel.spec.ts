// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import FormLabel from "../../../app/components/form/FormLabel.vue";
import render from "../../../test/render";

describe("FormLabel Component", () => {
  // MARK: Logic and Props
  describe("Logic and Props", () => {
    it("renders with required props (for and label)", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Test Label",
        },
      });

      const label = screen.getByText("Test Label");
      expect(label).toBeTruthy();
      expect(label.getAttribute("for")).toBe("test-input");
    });

    it("correctly associates label with form field via 'for' attribute", async () => {
      await render(FormLabel, {
        props: {
          for: "email-input",
          label: "Email Address",
        },
      });

      const label = screen.getByText("Email Address");
      expect(label.tagName).toBe("LABEL");
      expect(label.getAttribute("for")).toBe("email-input");
    });

    it("defaults 'required' prop to false when not provided", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Optional Field",
        },
      });

      const requiredIndicator = screen.queryByTestId(
        "required field indicator"
      );
      expect(requiredIndicator).toBeNull();
    });

    it("shows required indicator when 'required' prop is true", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Required Field",
          required: true,
        },
      });

      const requiredIndicator = screen.getByTestId("required field indicator");
      expect(requiredIndicator).toBeTruthy();
      expect(requiredIndicator.textContent?.trim()).toBe("*");
    });

    it("does not show required indicator when 'required' prop is false", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Optional Field",
          required: false,
        },
      });

      const requiredIndicator = screen.queryByTestId(
        "required field indicator"
      );
      expect(requiredIndicator).toBeNull();
    });

    it("renders the label text exactly as provided", async () => {
      const labelText = "User Name";
      await render(FormLabel, {
        props: {
          for: "username",
          label: labelText,
        },
      });

      const label = screen.getByText(labelText);
      expect(label.textContent).toBe(labelText);
    });
  });

  // MARK: Styling
  describe("Styling", () => {
    it("applies correct Tailwind classes to the container div", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Test Label",
        },
      });

      const container = screen.getByText("Test Label").parentElement;
      expect(container?.classList.contains("flex")).toBe(true);
      expect(container?.classList.contains("items-center")).toBe(true);
      expect(container?.classList.contains("space-x-1")).toBe(true);
    });

    it("applies correct Tailwind classes to the label element", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Test Label",
        },
      });

      const label = screen.getByText("Test Label");
      expect(label.classList.contains("text-base")).toBe(true);
      expect(label.classList.contains("font-semibold")).toBe(true);
      expect(label.classList.contains("text-primary-text")).toBe(true);
    });

    it("applies correct styling to required indicator span", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Test Label",
          required: true,
        },
      });

      const requiredIndicator = screen.getByTestId("required field indicator");
      expect(requiredIndicator.classList.contains("text-action-red")).toBe(
        true
      );
    });

    it("maintains consistent spacing between label and required indicator", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Test Label",
          required: true,
        },
      });

      // The container should have space-x-1 class for spacing
      const container = screen.getByText("Test Label").parentElement;
      expect(container?.classList.contains("space-x-1")).toBe(true);

      const label = screen.getByText("Test Label");
      const indicator = screen.getByTestId("required field indicator");
      expect(label.parentElement).toBe(indicator.parentElement);
    });
  });

  // MARK: Accessibility
  describe("Accessibility", () => {
    it("uses semantic HTML with <label> element", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Accessible Label",
        },
      });

      const label = screen.getByText("Accessible Label");
      expect(label.tagName).toBe("LABEL");
    });

    it("correctly links to form input via 'for' attribute", async () => {
      await render(FormLabel, {
        props: {
          for: "password-field",
          label: "Password",
        },
      });

      const label = screen.getByText("Password");
      expect(label.getAttribute("for")).toBe("password-field");
    });

    it("provides testid for required field indicator for testing", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Test",
          required: true,
        },
      });

      const indicator = screen.getByTestId("required field indicator");
      expect(indicator).toBeTruthy();
    });

    it("makes required status visible to screen readers via asterisk text", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Required Field",
          required: true,
        },
      });

      const asterisk = screen.getByText("*");
      expect(asterisk).toBeTruthy();
    });

    it("allows form field to be focused by clicking on label", async () => {
      await render(FormLabel, {
        props: {
          for: "clickable-input",
          label: "Click Me",
        },
      });

      const label = screen.getByText("Click Me");
      expect(label.getAttribute("for")).toBe("clickable-input");
    });
  });

  // MARK: Conditional Rendering
  describe("Conditional Rendering", () => {
    it("only renders required indicator when required is true", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Test",
          required: false,
        },
      });

      expect(screen.queryByTestId("required field indicator")).toBeNull();

      await render(FormLabel, {
        props: {
          for: "test-input-2",
          label: "Test Required",
          required: true,
        },
      });

      expect(screen.getByTestId("required field indicator")).toBeTruthy();
    });

    it("does not render asterisk when required is undefined", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Test",
        },
      });

      const asterisk = screen.queryByText("*");
      expect(asterisk).toBeNull();
    });

    it("v-if directive correctly hides/shows required indicator", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input-1",
          label: "Dynamic Required 1",
          required: false,
        },
      });

      const label1 = document.querySelector('label[for="test-input-1"]');
      const container1 = label1?.parentElement;
      expect(
        container1?.querySelector('[data-testid="required field indicator"]')
      ).toBeNull();

      await render(FormLabel, {
        props: {
          for: "test-input-2",
          label: "Dynamic Required 2",
          required: true,
        },
      });

      const label2 = document.querySelector('label[for="test-input-2"]');
      const container2 = label2?.parentElement;
      expect(
        container2?.querySelector('[data-testid="required field indicator"]')
      ).toBeTruthy();

      await render(FormLabel, {
        props: {
          for: "test-input-3",
          label: "Dynamic Required 3",
          required: false,
        },
      });

      const label3 = document.querySelector('label[for="test-input-3"]');
      const container3 = label3?.parentElement;
      expect(
        container3?.querySelector('[data-testid="required field indicator"]')
      ).toBeNull();
    });
  });

  // MARK: Edge Cases
  describe("Edge Cases", () => {
    it("handles empty string for label prop", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "",
        },
      });

      const label = document.querySelector('label[for="test-input"]');
      expect(label).toBeTruthy();
      expect(label?.textContent?.trim()).toBe("");
    });

    it("handles very long label text gracefully", async () => {
      const longLabel = "A".repeat(200);
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: longLabel,
        },
      });

      const label = screen.getByText(longLabel);
      expect(label.textContent).toBe(longLabel);
    });

    it("handles special characters in label text", async () => {
      const specialLabel = "Email & Password (required!)";
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: specialLabel,
        },
      });

      const label = screen.getByText(specialLabel);
      expect(label.textContent).toBe(specialLabel);
    });

    it("handles Unicode and emoji in label text", async () => {
      const unicodeLabel = "User Name 👤";
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: unicodeLabel,
        },
      });

      const label = screen.getByText(unicodeLabel);
      expect(label.textContent).toBe(unicodeLabel);
    });

    it("handles special characters in 'for' attribute", async () => {
      const specialId = "form-input-user_name-2024";
      await render(FormLabel, {
        props: {
          for: specialId,
          label: "Test",
        },
      });

      const label = screen.getByText("Test");
      expect(label.getAttribute("for")).toBe(specialId);
    });

    it("handles numeric strings in label", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "12345",
        },
      });

      const label = screen.getByText("12345");
      expect(label.textContent).toBe("12345");
    });

    it("handles label with whitespace", async () => {
      const labelWithSpaces = "  Label with spaces  ";
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: labelWithSpaces,
        },
      });

      const label = document.querySelector('label[for="test-input"]');
      expect(label).toBeTruthy();
      expect(label?.textContent).toBe(labelWithSpaces);
    });

    it("handles multiple sequential spaces in label", async () => {
      const labelWithMultipleSpaces = "First    Second";
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: labelWithMultipleSpaces,
        },
      });

      const label = document.querySelector('label[for="test-input"]');
      expect(label).toBeTruthy();
      expect(label?.textContent).toBe(labelWithMultipleSpaces);
    });
  });

  // MARK: Props Validation
  describe("Props Validation", () => {
    it("accepts valid string for 'for' prop", async () => {
      await render(FormLabel, {
        props: {
          for: "valid-id",
          label: "Test",
        },
      });

      const label = screen.getByText("Test");
      expect(label.getAttribute("for")).toBe("valid-id");
    });

    it("accepts valid string for 'label' prop", async () => {
      await render(FormLabel, {
        props: {
          for: "test",
          label: "Valid Label",
        },
      });

      expect(screen.getByText("Valid Label")).toBeTruthy();
    });

    it("accepts boolean true for 'required' prop", async () => {
      await render(FormLabel, {
        props: {
          for: "test",
          label: "Test",
          required: true,
        },
      });

      expect(screen.getByTestId("required field indicator")).toBeTruthy();
    });

    it("accepts boolean false for 'required' prop", async () => {
      await render(FormLabel, {
        props: {
          for: "test",
          label: "Test",
          required: false,
        },
      });

      expect(screen.queryByTestId("required field indicator")).toBeNull();
    });
  });

  // MARK: Component Structure
  describe("Component Structure", () => {
    it("renders container div as the root element", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Test",
        },
      });

      const label = screen.getByText("Test");
      const container = label.parentElement;
      expect(container?.tagName).toBe("DIV");
    });

    it("renders label as direct child of container", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Test",
        },
      });

      const label = screen.getByText("Test");
      const container = label.parentElement;
      expect(container?.contains(label)).toBe(true);
    });

    it("renders required indicator as sibling of label when required", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Test",
          required: true,
        },
      });

      const label = screen.getByText("Test");
      const indicator = screen.getByTestId("required field indicator");
      expect(label.parentElement).toBe(indicator.parentElement);
    });

    it("maintains correct DOM order: label first, then indicator", async () => {
      await render(FormLabel, {
        props: {
          for: "test-input",
          label: "Test Label",
          required: true,
        },
      });

      const container = screen.getByText("Test Label").parentElement;
      const children = Array.from(container?.children || []);

      expect(children[0].tagName).toBe("LABEL");
      expect(children[1].tagName).toBe("SPAN");
      expect(children[1].getAttribute("data-testid")).toBe(
        "required field indicator"
      );
    });
  });
});
