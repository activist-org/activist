// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import Shield from "../../../app/components/shield/Shield.vue";
import { IconMap } from "../../../shared/types/icon-map";
import render from "../../../test/render";

const defaultProps = {
  label: "test-label",
  icon: IconMap.ABOUT,
};

// Shield Basic Rendering

describe("Shield Basic Rendering", () => {
  it("renders with correct label and icon", async () => {
    await render(Shield, {
      props: defaultProps,
    });

    // Uses correct label
    const label = screen.getByText("test-label");
    expect(label).toBeTruthy();

    // Uses correct icon (`IconMap.ABOUT` has aria-label `bi:card-text`)
    const icon = screen.getByRole("img", { name: "bi:card-text" });
    expect(icon).toBeTruthy();
  });

  it("renders with correct default classes", async () => {
    const { container } = await render(Shield, {
      props: defaultProps,
    });

    const wrapper = container.querySelector("#test-wrapper > div");
    const classTokens = wrapper.classList;

    // Classes if `active` is true (default)
    expect(classTokens.contains("style-cta")).toBeTruthy();
    expect(classTokens.contains("style-cta-secondary")).toBeFalsy();

    // Classes if `isSelector` is true (default)
    expect(classTokens.contains("rounded-full")).toBeTruthy();
    expect(classTokens.contains("rounded-lg")).toBeFalsy();
  });

  it("renders error icon only if `active` and `isSelector` are true", async () => {
    await render(Shield, {
      props: { active: true, isSelector: true, ...defaultProps },
    });

    const icon = screen.getByRole("img", {
      name: /error: passwords do not match/i,
    });
    expect(icon).toBeTruthy();
  });
});

// Shield Visual & Responsive Styling

describe("Shield Visual & Responsive Styling", () => {
  it("applies responsive classes", async () => {
    const { container } = await render(Shield, {
      props: { isSelector: true, ...defaultProps },
    });

    const wrapper = container.querySelector("#test-wrapper > div > div");

    // If small screen, add class
    const classTokens = wrapper.classList;
    expect(classTokens.contains("max-sm:flex-grow")).toBeTruthy();
  });
});

// Shield Accessibility

describe("Shield Accessibility", () => {
  it("component is focusable", async () => {
    const { container } = await render(Shield, {
      props: defaultProps,
    });

    const wrapper = container.querySelector("#test-wrapper > div");

    // It has tabindex
    expect(wrapper.getAttribute("tabindex")).toBe("0");

    // It receives focus
    await wrapper.focus();
    expect(document.activeElement).toBe(wrapper);
  });
});
