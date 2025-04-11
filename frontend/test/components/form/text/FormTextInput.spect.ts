// SPDX-License-Identifier: AGPL-3.0-or-later
import FormTextInput from "@/components/form/text/FormTextInput.vue";
import render from "@/test/render";
import { fireEvent, screen, waitFor } from "@testing-library/vue";

function expectNormalLabel(label: HTMLElement) {
  expect(label.className, "Label should be normal size").toMatch(
    "translate-y-[1.125rem] pl-[12px]"
  );
}

function expectShrunkLabel(label: HTMLElement) {
  expect(label.className, "Label should be shrunk").toMatch(
    "translate-x-4 text-sm text-distinct-text"
  );
}

function expectNormalLegend(legend: HTMLElement) {
  expect(legend.classList, "Hidden legend should be normal size").not.toContain(
    "max-w-[0.01px]"
  );
}

function expectShrunkLegend(legend: HTMLElement) {
  expect(legend.className, "Hidden legend should be shrunk").toMatch(
    "max-w-[0.01px]"
  );
}

describe("FormTextInput", () => {
  it("shrinks label when focused", async () => {
    await render(FormTextInput, {
      props: {
        id: "test",
        label: "test focus",
      },
    });

    let label = screen.getByText("test focus");
    expectNormalLabel(label);

    let legend = screen.getByTestId("hidden-legend");
    expectNormalLegend(legend);

    const input = screen.getByLabelText("test focus");
    await fireEvent.focus(input);

    await waitFor(async () => {
      label = screen.getByText("test focus");
      expectShrunkLabel(label);

      legend = screen.getByTestId("hidden-legend");
      expectShrunkLegend(legend);
    });
  });

  it("expands label when empty and blurred", async () => {
    await render(FormTextInput, {
      props: {
        id: "test",
        label: "test blur",
      },
    });

    const input = screen.getByLabelText("test blur");
    await fireEvent.focus(input);
    await fireEvent.input(input, "text");
    await fireEvent.blur(input);

    await waitFor(async () => {
      const label = screen.getByText("test blur");
      expectShrunkLabel(label);

      const legend = screen.getByTestId("hidden-legend");
      expectShrunkLegend(legend);
    });

    await fireEvent.focus(input);
    await fireEvent.input(input, "");
    await fireEvent.blur(input);

    await waitFor(async () => {
      const label = screen.getByText("test blur");
      expectNormalLabel(label);

      const legend = screen.getByTestId("hidden-legend");
      expectShrunkLegend(legend);
    });
  });
});
