// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import { defineComponent, ref } from "vue";

import FormTextInput from "../../../../app/components/form/text/FormTextInput.vue";
import render from "../../../render";

function expectNormalLabel(label: HTMLElement) {
  expect(label.className, "Label should be normal size").toContain(
    "translate-y-[0.6rem]"
  );
  expect(label.className).toContain("pl-[12px]");
}

function expectShrunkLabel(label: HTMLElement) {
  expect(label.className, "Label should be shrunk").toContain("translate-x-4");
  expect(label.className).toContain("translate-y-[-0.5rem]");
  expect(label.className).toContain("text-sm");
  expect(label.className).toContain("text-distinct-text");
}

function expectNormalLegend(legend: HTMLElement) {
  expect(legend.className, "Hidden legend should be normal size").toContain(
    "max-w-[0.01px]"
  );
}

function expectShrunkLegend(legend: HTMLElement) {
  expect(legend.className, "Hidden legend should be shrunk").not.toContain(
    "max-w-[0.01px]"
  );
}

const createWrapper = (id: string, label: string) =>
  defineComponent({
    components: { FormTextInput },
    setup() {
      const value = ref("");
      return { value, id, label };
    },
    template: `<FormTextInput v-model="value" :id="id" :label="label" />`,
  });

describe("FormTextInput", () => {
  it("shrinks label when focused", async () => {
    await render(createWrapper("test", "test focus"));

    let label = screen.getByText("test focus", { selector: "label" });
    expectNormalLabel(label);

    let legend = screen.getByTestId("hidden-legend");
    expectNormalLegend(legend);

    const input = screen.getByLabelText("test focus");
    await fireEvent.focus(input);

    await waitFor(async () => {
      label = screen.getByText("test focus", { selector: "label" });
      expectShrunkLabel(label);

      legend = screen.getByTestId("hidden-legend");
      expectShrunkLegend(legend);
    });
  });

  it("expands label when empty and blurred", async () => {
    await render(createWrapper("test", "test blur"));

    const input = screen.getByLabelText("test blur");
    await fireEvent.focus(input);

    await waitFor(async () => {
      const label = screen.getByText("test blur", { selector: "label" });
      expectShrunkLabel(label);

      const legend = screen.getByTestId("hidden-legend");
      expectShrunkLegend(legend);
    });

    await fireEvent.blur(input);

    await waitFor(async () => {
      const label = screen.getByText("test blur", { selector: "label" });
      expectNormalLabel(label);

      const legend = screen.getByTestId("hidden-legend");
      expectNormalLegend(legend);
    });
  });
});
