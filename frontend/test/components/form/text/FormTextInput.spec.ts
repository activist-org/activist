// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import { defineComponent, ref } from "vue";

import FormTextInput from "../../../../app/components/form/text/FormTextInput.vue";
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
});
