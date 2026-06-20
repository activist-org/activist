// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import Collapsable from "../../app/components/Collapsable.vue";
import render from "../render";

const stubs = {
  Icon: {
    template: '<span :class="$attrs.class" />',
  },
};

describe("Collapsable", () => {
  it("renders the label on the button", async () => {
    await render(Collapsable, {
      props: { label: "Section title" },
      global: { stubs },
    });

    expect(screen.getByRole("button", { name: /section title/i })).toBeTruthy();
  });

  it("hides slot content by default", async () => {
    await render(Collapsable, {
      props: { label: "Section title" },
      slots: { default: "<p>Hidden content</p>" },
      global: { stubs },
    });

    expect(screen.queryByText("Hidden content")).toBeNull();
  });

  it("shows slot content when isOpen prop is true", async () => {
    await render(Collapsable, {
      props: { label: "Section title", isOpen: true },
      slots: { default: "<p>Visible content</p>" },
      global: { stubs },
    });

    expect(screen.getByText("Visible content")).toBeTruthy();
  });

  it("toggles slot content open on button click", async () => {
    await render(Collapsable, {
      props: { label: "Section title" },
      slots: { default: "<p>Toggle content</p>" },
      global: { stubs },
    });

    expect(screen.queryByText("Toggle content")).toBeNull();

    await fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Toggle content")).toBeTruthy();
  });

  it("toggles slot content closed on second button click", async () => {
    await render(Collapsable, {
      props: { label: "Section title" },
      slots: { default: "<p>Toggle content</p>" },
      global: { stubs },
    });

    await fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Toggle content")).toBeTruthy();

    await fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByText("Toggle content")).toBeNull();
  });

  it("applies rotate class to icon when open", async () => {
    const { container } = await render(Collapsable, {
      props: { label: "Section title", isOpen: true },
      global: { stubs },
    });

    const icon = container.querySelector("span");
    expect(icon?.classList.contains("rotate-180")).toBe(true);
  });

  it("does not apply rotate class to icon when closed", async () => {
    const { container } = await render(Collapsable, {
      props: { label: "Section title", isOpen: false },
      global: { stubs },
    });

    const icon = container.querySelector("span");
    expect(icon?.classList.contains("rotate-180")).toBe(false);
  });
});
