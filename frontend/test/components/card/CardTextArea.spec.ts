// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardTextArea from "../../../app/components/card/CardTextArea.vue";
import render from "../../render";

const baseProps = {
  header: "Feedback",
  description: "Tell us what you think.",
  placeholder: "Type here...",
  textAreaAriaLabel: "Feedback input",
};

describe("CardTextArea", () => {
  it("renders the header and description", async () => {
    await render(CardTextArea, { props: { ...baseProps, multiline: false } });

    expect(screen.getByText("Feedback")).toBeTruthy();
    expect(screen.getByText("Tell us what you think.")).toBeTruthy();
  });

  it("does not render the description when it is empty", async () => {
    await render(CardTextArea, {
      props: { ...baseProps, description: "", multiline: false },
    });

    expect(screen.queryByText("Tell us what you think.")).toBeNull();
  });

  it("renders a single-line input when multiline is false", async () => {
    const { container } = await render(CardTextArea, {
      props: { ...baseProps, multiline: false },
    });

    const input = container.querySelector("input[type='text']");
    expect(input).toBeTruthy();
    expect(input?.getAttribute("placeholder")).toBe("Type here...");
    expect(input?.getAttribute("aria-label")).toBe("Feedback input");
    expect(container.querySelector("textarea")).toBeNull();
  });

  it("renders a textarea when multiline is true", async () => {
    const { container } = await render(CardTextArea, {
      props: { ...baseProps, multiline: true },
    });

    const textareas = container.querySelectorAll("textarea");
    // Only one of the mobile/desktop textareas renders, based on breakpoint.
    expect(textareas.length).toBe(1);
    expect(textareas[0]?.getAttribute("placeholder")).toBe("Type here...");
    expect(textareas[0]?.getAttribute("aria-label")).toBe("Feedback input");
    expect(container.querySelector("input[type='text']")).toBeNull();
  });
});
