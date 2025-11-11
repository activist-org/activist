// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import { defineComponent, ref } from "vue";

import FormTextInput from "~/components/form/text/FormTextInput.vue";

import render from "../../../render";

// Test wrapper to enable v-model for correct reactivity in tests.
const TestWrapper = defineComponent({
  components: { FormTextInput },
  props: ["id", "label"],
  setup(_props) {
    const modelValue = ref("");
    return { modelValue };
  },
  template: `
    <FormTextInput
      :id="id"
      :label="label"
      v-model="modelValue"
    />
  `,
});

// MARK: Label Helpers

function expectNormalLabel(label: HTMLElement) {
  expect(label.className, "Label should be normal size").toMatch(
    "translate-y-[0.6rem] pl-[12px]"
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

describe("FormTextInput", () => {
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
      expectNormalLabel(label);

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

  // Kirthiiii
  // MARK: Rendering Tests
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
  it("emits update:modelValue on user input", async () => {
    const { emitted } = await render(FormTextInput, {
      props: { id: "logic-id", label: "Logic Test" },
    });

    const input = screen.getByRole("textbox");
    await fireEvent.update(input, "hello world");

    expect(emitted("update:modelValue")).toBeTruthy();
    expect(emitted("update:modelValue")[0]).toEqual(["hello world"]);
  });

  // MARK: Edge Cases Tests
  it("handles empty string id and label gracefully", async () => {
    await render(TestWrapper, { props: { id: "", label: "" } });

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
});

// Prop Usage Tests -- Kirthi added
// it("renders even if required props are missing", async () => {
//   // intentionally having empty props to simulate error
//   const { container } = await render(FormTextInput, { props: {} });

//   // Should still render an input safely
//   const input = container.querySelector("input");
//   expect(input).toBeTruthy();
// });

// // it("handles invalid iconLocation by not rendering", async () => {
// //   // intentially providing bad prop value (location can only be left or right)
// //   await render(FormTextInput, {
// //     props: { id: "test", label: "Bad Icon", iconLocation: "middle" },
// //     slots: {icons: "<span data-testid='mock-icon'>Icon</span>",},
// //   });

// //   // Should render as if 'right' was used (default location)
// //   const leftIcon = screen.queryByTestId("left");
// //   const rightIcon = screen.queryByTestId("icon-right");
// //   expect(leftIcon).toBeNull();
// //   expect(rightIcon).toBeNull();
// // });

// it("iconLocation should default to 'right' when not provided", async () => {
//   const { container } = await render(FormTextInput, {
//     props: { id: "test", label: "Default Icon" },
//     slots: { icons: "<span>Icon</span>" },
//   });

//   const iconSpans = container.querySelectorAll("span.flex.items-center");
//   expect(iconSpans.length).toBe(1);
//   expect(iconSpans[0].textContent).toContain("Icon");
// });

// it("does not render icons when iconLocation prop is invalid", async () => {
//   await render(FormTextInput, {
//     props: { id: "test", label: "Bad Icon", iconLocation: "middle" }, // middle is the invalid value
//     slots: { icons: "<span data-testid='mock-icon'>Icon</span>" },
//   });
//   // (neither left nor right condition matches)
//   const icon = screen.queryByText("Icon");
//   expect(icon).toBeNull();
// });
