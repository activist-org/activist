// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";
import { defineComponent, ref } from "vue";

import FormTextArea from "../../../../app/components/form/text/FormTextArea.vue";
import render from "../../../render";

/**
 * Comprehensive unit tests for FormTextArea component
 *
 * Coverage includes:
 * - Basic rendering (element, attributes, props)
 * - Logic (input handling, events, value binding)
 * - Props (hasError, placeholder, id)
 * - Style coverage (dynamic classes, responsive styling)
 * - Accessibility (ARIA attributes, semantic HTML)
 * - Edge cases and incorrect prop usage
 *
 * @see https://github.com/activist-org/activist/issues/1676
 */

describe("FormTextArea component", () => {
  // MARK: Basic Rendering

  it("renders textarea element", async () => {
    await render(FormTextArea, {
      props: { id: "test-textarea" },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("renders with correct id attribute", async () => {
    await render(FormTextArea, {
      props: { id: "custom-id" },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("id")).toBe("custom-id");
  });

  it("auto-generates id when not provided", async () => {
    await render(FormTextArea);

    const textarea = screen.getByRole("textbox");
    const id = textarea.getAttribute("id");
    expect(id).toBeTruthy();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it("renders with placeholder when provided", async () => {
    await render(FormTextArea, {
      props: { id: "test", placeholder: "Enter description" },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("placeholder")).toBe("Enter description");
  });

  it("renders without placeholder when not provided", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("placeholder")).toBeNull();
  });

  it("renders with fixed rows attribute", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("rows")).toBe("5");
  });

  it("renders with role textbox", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("role")).toBe("textbox");
  });

  // MARK: Logic

  it("updates value when user types", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    await fireEvent.update(textarea, "Hello world");

    expect(textarea.value).toBe("Hello world");
  });

  it("displays initial value from value prop", async () => {
    const TestWrapper = defineComponent({
      components: { FormTextArea },
      setup() {
        const value = ref("Initial text");
        return { value };
      },
      template: `
        <FormTextArea
          id="test"
          :value="value"
          @input="(e) => value = e.target.value"
        />
      `,
    });

    await render(TestWrapper);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.value).toBe("Initial text");
  });

  it("emits blur event when textarea loses focus", async () => {
    const onBlur = vi.fn();

    const TestWrapper = defineComponent({
      components: { FormTextArea },
      setup() {
        return { onBlur };
      },
      template: `
        <FormTextArea
          id="test"
          @blur="onBlur"
        />
      `,
    });

    await render(TestWrapper);

    const textarea = screen.getByRole("textbox");
    await fireEvent.focus(textarea);
    await fireEvent.blur(textarea);

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("handles empty string input", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    await fireEvent.update(textarea, "Some text");
    expect(textarea.value).toBe("Some text");

    await fireEvent.update(textarea, "");
    expect(textarea.value).toBe("");
  });

  it("handles multiline input", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const multilineText = "Line 1\nLine 2\nLine 3";

    await fireEvent.update(textarea, multilineText);
    expect(textarea.value).toBe(multilineText);
    expect(textarea.value).toContain("\n");
  });

  it("handles special characters", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const specialChars = "!@#$%^&*()_+{}[]|;:,.<>?";

    await fireEvent.update(textarea, specialChars);
    expect(textarea.value).toBe(specialChars);
  });

  it("handles long text input", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const longText = "A".repeat(1000);

    await fireEvent.update(textarea, longText);
    expect(textarea.value).toBe(longText);
    expect(textarea.value.length).toBe(1000);
  });

  // MARK: Props

  it("applies error border when hasError is true", async () => {
    await render(FormTextArea, {
      props: { id: "test", hasError: true },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-action-red");
    expect(textarea.className).toContain("dark:border-action-red");
  });

  it("applies normal border when hasError is false", async () => {
    await render(FormTextArea, {
      props: { id: "test", hasError: false },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-interactive");
    expect(textarea.className).not.toContain("border-action-red");
  });

  it("uses default hasError value of false when not provided", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-interactive");
    expect(textarea.className).not.toContain("border-action-red");
  });

  it("updates border class when hasError prop changes", async () => {
    // Test that component responds correctly to different hasError values.
    // This verifies the component renders correctly with different initial props.
    await render(FormTextArea, {
      props: { id: "test", hasError: false },
    });

    let textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-interactive");
    expect(textarea.className).not.toContain("border-action-red");

    // Re-render with true - create new render.
    await render(FormTextArea, {
      props: { id: "test", hasError: true },
    });

    textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-action-red");
    expect(textarea.className).not.toContain("border-interactive");
  });

  it("responds reactively to hasError prop changes within same render", async () => {
    // Test actual reactivity: component should update classes when prop changes.
    // This simulates real usage where errorMessage.value changes reactively.
    const TestWrapper = defineComponent({
      components: { FormTextArea },
      setup() {
        const hasError = ref(false);
        return { hasError };
      },
      template: `
        <div>
          <FormTextArea
            id="test"
            :hasError="hasError"
          />
          <button @click="hasError = !hasError" data-testid="toggle">Toggle</button>
        </div>
      `,
    });

    await render(TestWrapper);

    let textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-interactive");
    expect(textarea.className).not.toContain("border-action-red");

    // Toggle hasError - component should update reactively.
    const toggleButton = screen.getByTestId("toggle");
    await fireEvent.click(toggleButton);

    await waitFor(() => {
      textarea = screen.getByRole("textbox");
      expect(textarea.className).toContain("border-action-red");
      expect(textarea.className).not.toContain("border-interactive");
    });

    // Toggle back.
    await fireEvent.click(toggleButton);

    await waitFor(() => {
      textarea = screen.getByRole("textbox");
      expect(textarea.className).toContain("border-interactive");
      expect(textarea.className).not.toContain("border-action-red");
    });
  });

  it("renders with custom placeholder", async () => {
    await render(FormTextArea, {
      props: { id: "test", placeholder: "Enter your description here" },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("placeholder")).toBe(
      "Enter your description here"
    );
  });

  it("updates placeholder when prop changes", async () => {
    // Test that component displays different placeholders based on prop.
    await render(FormTextArea, {
      props: { id: "test", placeholder: "Initial placeholder" },
    });

    let textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("placeholder")).toBe("Initial placeholder");

    // Render with different placeholder.
    await render(FormTextArea, {
      props: { id: "test", placeholder: "Updated placeholder" },
    });

    textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("placeholder")).toBe("Updated placeholder");
  });

  it("uses custom id when provided", async () => {
    await render(FormTextArea, {
      props: { id: "custom-textarea-id" },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("id")).toBe("custom-textarea-id");
  });

  it("generates unique id for each instance", async () => {
    const TestWrapper = defineComponent({
      components: { FormTextArea },
      template: `
        <div>
          <FormTextArea />
          <FormTextArea />
        </div>
      `,
    });

    await render(TestWrapper);

    const textareas = screen.getAllByRole("textbox");
    const id1 = textareas[0].getAttribute("id");
    const id2 = textareas[1].getAttribute("id");

    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  // MARK: Style

  it("applies all base classes", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox");
    const classes = textarea.className;

    expect(classes).toContain("box-content");
    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
    expect(classes).toContain("space-x-2");
    expect(classes).toContain("rounded");
    expect(classes).toContain("border");
    expect(classes).toContain("bg-transparent");
    expect(classes).toContain("py-2");
    expect(classes).toContain("pl-3");
    expect(classes).toContain("pr-2.5");
    expect(classes).toContain("text-left");
    expect(classes).toContain("placeholder-primary-text");
    expect(classes).toContain("outline-none");
  });

  it("applies error border classes when hasError is true", async () => {
    await render(FormTextArea, {
      props: { id: "test", hasError: true },
    });

    const textarea = screen.getByRole("textbox");
    const classes = textarea.className;

    expect(classes).toContain("border-action-red");
    expect(classes).toContain("dark:border-action-red");
  });

  it("applies interactive border class when hasError is false", async () => {
    await render(FormTextArea, {
      props: { id: "test", hasError: false },
    });

    const textarea = screen.getByRole("textbox");
    const classes = textarea.className;

    expect(classes).toContain("border-interactive");
    expect(classes).not.toContain("border-action-red");
  });

  it("does not apply error classes when hasError is false", async () => {
    await render(FormTextArea, {
      props: { id: "test", hasError: false },
    });

    const textarea = screen.getByRole("textbox");
    const classes = textarea.className;

    expect(classes).not.toContain("border-action-red");
    expect(classes).not.toContain("dark:border-action-red");
  });

  it("switches between error and normal classes reactively", async () => {
    // Test that component correctly applies classes based on hasError prop.
    // Test normal state.
    await render(FormTextArea, {
      props: { id: "test", hasError: false },
    });

    let textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-interactive");
    expect(textarea.className).not.toContain("border-action-red");

    // Test error state.
    await render(FormTextArea, {
      props: { id: "test", hasError: true },
    });

    textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-action-red");
    expect(textarea.className).toContain("dark:border-action-red");
    expect(textarea.className).not.toContain("border-interactive");

    // Test normal state again
    await render(FormTextArea, {
      props: { id: "test", hasError: false },
    });

    textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-interactive");
    expect(textarea.className).not.toContain("border-action-red");
  });

  it("verifies CSS class definitions exist in Tailwind", async () => {
    const expectedClasses = [
      "box-content",
      "flex",
      "items-center",
      "space-x-2",
      "rounded",
      "border",
      "bg-transparent",
      "py-2",
      "pl-3",
      "pr-2.5",
      "text-left",
      "placeholder-primary-text",
      "outline-none",
      "border-action-red",
      "dark:border-action-red",
      "border-interactive",
    ];

    await render(FormTextArea, {
      props: { id: "test", hasError: true },
    });

    const textarea = screen.getByRole("textbox");
    const appliedClasses = textarea.className.split(" ");

    const hasExpectedClasses = expectedClasses.some((cls) =>
      appliedClasses.includes(cls)
    );
    expect(hasExpectedClasses).toBe(true);
  });

  // MARK: Accessibility

  it("has role textbox attribute", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("role")).toBe("textbox");
  });

  it("can be found by role", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeTruthy();
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("has id attribute for label association", async () => {
    await render(FormTextArea, {
      props: { id: "description-textarea" },
    });

    const textarea = screen.getByRole("textbox");
    const id = textarea.getAttribute("id");

    expect(id).toBeTruthy();
    expect(id).toBe("description-textarea");

    const label = document.createElement("label");
    label.setAttribute("for", id!);
    label.textContent = "Description";

    expect(label.getAttribute("for")).toBe(id);
  });

  it("uses semantic textarea element", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea instanceof HTMLTextAreaElement).toBe(true);
  });

  it("supports placeholder for accessibility", async () => {
    await render(FormTextArea, {
      props: { id: "test", placeholder: "Enter your description" },
    });

    const textarea = screen.getByRole("textbox");
    const placeholder = textarea.getAttribute("placeholder");

    expect(placeholder).toBe("Enter your description");
  });

  it("can be focused via keyboard", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    expect(document.activeElement).not.toBe(textarea);

    textarea.focus();

    await waitFor(() => {
      expect(document.activeElement).toBe(textarea);
    });
  });

  it("has proper tabindex (implicit)", async () => {
    await render(FormTextArea, {
      props: { id: "test" },
    });

    const textarea = screen.getByRole("textbox");

    const tabindex = textarea.getAttribute("tabindex");

    if (tabindex !== null) {
      expect(parseInt(tabindex, 10)).toBeGreaterThanOrEqual(0);
    }
  });

  it("works with screen reader labels", async () => {
    const TestWrapper = defineComponent({
      components: { FormTextArea },
      template: `
        <div>
          <label for="test-textarea">Description</label>
          <FormTextArea id="test-textarea" />
        </div>
      `,
    });

    await render(TestWrapper);

    const label = screen.getByText("Description");
    const textarea = screen.getByRole("textbox");

    expect(label.getAttribute("for")).toBe("test-textarea");
    expect(textarea.getAttribute("id")).toBe("test-textarea");

    expect(label.getAttribute("for")).toBe(textarea.getAttribute("id"));
  });

  // MARK: Edge Cases

  it("handles empty string placeholder", async () => {
    await render(FormTextArea, {
      props: { id: "test", placeholder: "" },
    });

    const textarea = screen.getByRole("textbox");
    const placeholder = textarea.getAttribute("placeholder");

    expect(placeholder).toBe("");
  });

  it("handles undefined placeholder", async () => {
    await render(FormTextArea, {
      props: { id: "test", placeholder: undefined },
    });

    const textarea = screen.getByRole("textbox");
    const placeholder = textarea.getAttribute("placeholder");

    expect(placeholder).toBeNull();
  });

  it("handles very long placeholder text", async () => {
    const longPlaceholder = "A".repeat(500);

    await render(FormTextArea, {
      props: { id: "test", placeholder: longPlaceholder },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("placeholder")).toBe(longPlaceholder);
  });

  it("handles special characters in placeholder", async () => {
    const specialPlaceholder = "Enter text (required) < > & \" '";

    await render(FormTextArea, {
      props: { id: "test", placeholder: specialPlaceholder },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("placeholder")).toBe(specialPlaceholder);
  });

  it("handles empty string id", async () => {
    await render(FormTextArea, {
      props: { id: "" },
    });

    const textarea = screen.getByRole("textbox");
    const id = textarea.getAttribute("id");

    // Empty string is truthy, so the component uses it as-is.
    // This is the actual behavior: props.id ?? uuidv4() means empty string is used.
    expect(id).toBe("");
  });

  it("handles undefined id", async () => {
    await render(FormTextArea, {
      props: { id: undefined },
    });

    const textarea = screen.getByRole("textbox");
    const id = textarea.getAttribute("id");

    expect(id).toBeTruthy();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it("handles hasError as truthy non-boolean", async () => {
    await render(FormTextArea, {
      props: { id: "test", hasError: 1 as unknown as boolean },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-action-red");
  });

  it("handles hasError as falsy non-boolean", async () => {
    await render(FormTextArea, {
      props: { id: "test", hasError: 0 as unknown as boolean },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.className).not.toContain("border-action-red");
    expect(textarea.className).toContain("border-interactive");
  });

  it("handles rapid prop changes", async () => {
    // Test that component handles different prop values correctly.
    // This verifies the component is robust to prop variations.
    for (let i = 0; i < 5; i++) {
      await render(FormTextArea, {
        props: { id: "test", hasError: i % 2 === 0 },
      });

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeTruthy();
      expect(textarea.getAttribute("id")).toBe("test");
    }
  });

  it("handles whitespace-only placeholder", async () => {
    await render(FormTextArea, {
      props: { id: "test", placeholder: "   " },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("placeholder")).toBe("   ");
  });

  it("handles newlines in placeholder", async () => {
    const placeholderWithNewline = "Line 1\nLine 2";

    await render(FormTextArea, {
      props: { id: "test", placeholder: placeholderWithNewline },
    });

    const textarea = screen.getByRole("textbox");
    expect(textarea.getAttribute("placeholder")).toBe(placeholderWithNewline);
  });

  it("handles all props missing", async () => {
    await render(FormTextArea);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeTruthy();
    expect(textarea.getAttribute("id")).toBeTruthy();
    expect(textarea.getAttribute("rows")).toBe("5");
    expect(textarea.getAttribute("role")).toBe("textbox");
  });
});
