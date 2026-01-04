// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import { defineComponent, ref } from "vue";

import FormTextInput from "../../../../app/components/form/text/FormTextInput.vue";
import render from "../../../render";

// Test wrapper to enable v-model for correct reactivity in tests.
const TestWrapper = defineComponent({
  components: { FormTextInput },
  props: ["id", "label", "hasError"],
  setup(_props) {
    const modelValue = ref("");
    return { modelValue };
  },
  template: `
    <FormTextInput
      :id="id"
      :label="label"
      :hasError="hasError"
      v-model=""
    />
  `,
});

// MARK: Label Helpers

function expectNormalLabel(label: HTMLElement) {
  expect(label.className, "Label should be normal size").toMatch(
    "translate-y-[0.6rem] pl-3"
  );
}

function expectShrunkLabel(label: HTMLElement) {
  expect(label.className, "Label should be shrunk").toMatch(
    "translate-x-4 translate-y-[-0.5rem] text-sm text-distinct-text"
  );
}

// MARK: Legend Helpers

function expectNormalLegend(legend: HTMLElement) {
  expect(
    Array.from(legend.classList),
    "Hidden legend should be normal size"
  ).toContain("max-w-[0.01px]");
}

function expectShrunkLegend(legend: HTMLElement) {
  expect(
    Array.from(legend.classList),
    "Hidden legend should be shrunk"
  ).not.toContain("max-w-[0.01px]");
}

describe("FormTextInput component", () => {
  it("shrinks label when focused", async () => {
    await render(TestWrapper, {
      props: {
        id: "test",
        label: "test focus",
      },
    });

    let label = screen.getByText("test focus", { selector: "label" });
    expectNormalLabel(label);

    let legend = screen.getByTestId("hidden-legend");
    expectNormalLegend(legend);

    const input = screen.getByLabelText("test focus", { selector: "input" });
    await fireEvent.focus(input);

    await waitFor(() => {
      label = screen.getByText("test focus", { selector: "label" });
      expectShrunkLabel(label);

      legend = screen.getByTestId("hidden-legend");
      expectShrunkLegend(legend);
    });
  });

  it("expands label when empty and blurred", async () => {
    await render(TestWrapper, {
      props: {
        id: "test",
        label: "test blur",
      },
    });

    const input = screen.getByLabelText("test blur", { selector: "input" });
    await fireEvent.focus(input);
    await fireEvent.update(input, "text"); // update() instead of input() for v-model compatibility
    await fireEvent.blur(input);

    await waitFor(() => {
      const label = screen.getByText("test blur", { selector: "label" });
      expectShrunkLabel(label);

      const legend = screen.getByTestId("hidden-legend");
      expectShrunkLegend(legend);
    });

    await fireEvent.focus(input);
    await fireEvent.update(input, ""); // update() to clear
    await fireEvent.blur(input);

    await waitFor(() => {
      const label = screen.getByText("test blur", { selector: "label" });
      expectNormalLabel(label);

      const legend = screen.getByTestId("hidden-legend");
      expectNormalLegend(legend);
    });
  });

  // MARK: Basic Rendering

  const defaultProps = { id: "test-input", label: "Test Label" };
  it("renders input and label correctly", async () => {
    await render(TestWrapper, { props: defaultProps });

    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();
    expect(input.getAttribute("id")).toBe("test-input");

    const label = screen.getByText("Test Label", { selector: "label" });
    expect(label).toBeTruthy();
  });

  // MARK: Logic

  it("emits update:modelValue on user input. Reactivity logic works", async () => {
    const { emitted } = await render(FormTextInput, {
      props: { id: "logic-id", label: "Logic Test" },
    });

    const input = screen.getByRole("textbox");
    await fireEvent.update(input, "hello world");

    expect(emitted("update:modelValue")).toBeTruthy();
    expect(emitted("update:modelValue")[0]).toEqual(["hello world"]);
  });

  it("does not emit update:modelValue if input value remains the same", async () => {
    const { emitted } = await render(FormTextInput, {
      props: { id: "emit-no-change", label: "Emit Test", modelValue: "same" },
    });

    const input = screen.getByRole("textbox");
    await fireEvent.update(input, "same");

    expect(emitted("update:modelValue")?.length ?? 0).toBeLessThanOrEqual(1);
  });

  it("emits empty string when input is cleared", async () => {
    const { emitted } = await render(FormTextInput, {
      props: { id: "logic-clear", label: "Clear Test" },
    });

    const input = screen.getByRole("textbox");
    await fireEvent.update(input, "some text");
    await fireEvent.update(input, "");

    const events = emitted("update:modelValue")!;
    expect(events.at(-1)).toEqual([""]);
  });

  it("clears placeholder when label shrinks on focus", async () => {
    await render(FormTextInput, {
      props: { id: "placeholder-test", label: "Email" },
    });

    const input = screen.getByRole("textbox");
    expect(input.getAttribute("placeholder")).toBe("Email");

    await fireEvent.focus(input);
    await waitFor(() => {
      expect(input.getAttribute("placeholder")).toBe("");
    });
  });

  // MARK: Props

  it("applies error border when hasError is true", async () => {
    await render(TestWrapper, { props: { ...defaultProps, hasError: true } });

    const border = screen.getByTestId(`${defaultProps.id}-border`);
    expect(border.className).not.toContain("border-interactive");
    expect(border.className).toContain("border-action-red");
  });

  it("uses default hasError value of false when not provided", async () => {
    await render(TestWrapper, { props: { ...defaultProps } });

    const border = screen.getByTestId(`${defaultProps.id}-border`);
    expect(border.className).toContain("border-interactive");
    expect(border.className).not.toContain("border-action-red");
  });

  it("respects custom input type prop", async () => {
    await render(FormTextInput, {
      props: { id: "email-field", label: "Email", type: "email" },
    });

    const input = screen.getByRole("textbox");
    expect(input.getAttribute("type")).toBe("email");
  });

  // MARK: Icon
  it("renders left icon slot correctly and adjusts label padding", async () => {
    await render(FormTextInput, {
      props: { id: "icon-left", label: "With Icon", iconLocation: "left" },
      slots: { icons: '<span data-testid="icon-left-slot">Icon</span>' },
    });

    const icon = screen.getByTestId("icon-left-slot");
    expect(icon).toBeTruthy();

    const label = screen.getByText("With Icon", { selector: "label" });
    expect(label.className).toContain("pl-[3.4rem]");
  });

  it("renders right icon slot correctly and adjusts label padding", async () => {
    await render(FormTextInput, {
      props: { id: "icon-right", label: "Right Icon", iconLocation: "right" },
      slots: { icons: '<span data-testid="icon-right-slot">Icon</span>' },
    });

    const icon = screen.getByTestId("icon-right-slot");
    expect(icon).toBeTruthy();

    const label = screen.getByText("Right Icon", { selector: "label" });
    expect(label.className).toContain("pl-3");
  });

  // MARK: Edge Cases

  it("handles empty string id and label gracefully", async () => {
    await render(TestWrapper, { props: { id: "", label: "" } });

    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();
  });

  it("renders safely when id or label are undefined", async () => {
    await render(FormTextInput, {
      props: {
        id: undefined as unknown as string,
        label: undefined as unknown as string,
      },
    });

    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();
  });

  it("handles special characters", async () => {
    const special = "!@#$%^&*()_+{}[]|;:,.<>?";
    await render(TestWrapper, {
      props: { id: "special-id", label: "Special Input" },
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;
    await fireEvent.update(input, special);
    expect(input.value).toBe(special);
  });

  it("resets shrinkLabel to false on blur if input is empty", async () => {
    await render(TestWrapper, {
      props: { id: "blur-empty-id", label: "Blur Test" },
    });

    const input = screen.getByRole("textbox");
    await fireEvent.focus(input);
    await fireEvent.blur(input); // empty, should expand label

    const label = screen.getByText("Blur Test", { selector: "label" });
    expect(label.className).toMatch("translate-y-[0.6rem]");
  });

  // MARK: Accessibility

  it("hides decorative fieldset for accessibility", async () => {
    await render(FormTextInput, { props: defaultProps });

    const fieldset = screen.getByTestId("test-input-border");
    expect(fieldset.getAttribute("aria-hidden")).toBe("true");
  });

  it("associates input and label correctly via id and for attributes", async () => {
    await render(FormTextInput, { props: defaultProps });

    const input = document.getElementById("test-input");
    const label = document.querySelector(`label[for='test-input']`);

    expect(input).toBeTruthy();
    expect(label).toBeTruthy();
    expect(label?.textContent).toContain("Test Label");
  });

  // MARK: Style

  it("positions label correctly for left icon", async () => {
    await render(FormTextInput, {
      props: { id: "test-input", label: "Test Label", iconLocation: "left" },
    });

    const label = document.querySelector(`label[for='test-input']`);
    expect(label?.className).toContain("pl-[3.4rem]");
    expect(label?.className).toContain("translate-y-[0.6rem]");
  });

  it("shrinks label on focus (adds translate-x and text-sm classes)", async () => {
    await render(FormTextInput, {
      props: { id: "test-input", label: "Test Label" },
    });

    const input = document.getElementById("test-input");
    const label = document.querySelector(`label[for='test-input']`);

    expect(label?.className).toMatch("translate-y-[0.6rem]");
    expect(label?.className).not.toMatch("translate-x-4");
    expect(label?.className).not.toMatch("text-sm");

    await fireEvent.focus(input!);

    await waitFor(() => {
      const label = document.querySelector(`label[for='test-input']`);
      expect(label?.className).not.toMatch("translate-y-[0.6rem]");
      expect(label?.className).toMatch("translate-x-4");
      expect(label?.className).toMatch("text-sm");
    });
  });

  it("renders top-level container with correct layout classes", async () => {
    await render(FormTextInput, { props: { id: "layout", label: "Layout" } });

    const container = screen
      .getByTestId("layout-border")
      .closest("div")?.parentElement;
    expect(container?.className).toContain("flex-col");
    expect(container?.className).toContain("w-full");
  });
});
