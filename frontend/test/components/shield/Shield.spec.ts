// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import Shield from "../../../app/components/shield/Shield.vue";
import { IconMap } from "../../../shared/types/icon-map";
import render from "../../../test/render";

type ShieldProps = {
  label: string;
  active?: boolean;
  isSelector?: boolean;
  icon: IconMap;
};

const createWrapper = async (props: Partial<ShieldProps> = {}) =>
  await render(Shield, {
    props: {
      label: "test-label",
      icon: IconMap.ABOUT,
      ...props,
    },
  });

// MARK: Basic Rendering

describe("Shield Basic Rendering", () => {
  it("renders with correct label and icon", async () => {
    await createWrapper();

    // Uses correct label.
    const label = screen.getByText("test-label");
    expect(label).toBeTruthy();

    // Uses correct icon (`IconMap.ABOUT` has aria-label `bi:card-text`).
    const icon = screen.getByRole("img", { name: "bi:card-text" });
    expect(icon).toBeTruthy();
  });

  it("renders with correct default classes", async () => {
    const { container } = await createWrapper();

    const wrapper = container.querySelector('[tabindex="0"]') as HTMLElement;
    const classTokens = wrapper.classList;

    // Classes if `active` is true (default).
    expect(classTokens.contains("style-cta")).toBeTruthy();
    expect(classTokens.contains("style-cta-secondary")).toBeFalsy();

    // Classes if `isSelector` is false (default).
    expect(classTokens.contains("rounded-full")).toBeTruthy();
    expect(classTokens.contains("rounded-lg")).toBeFalsy();
  });

  it("renders error icon only if `active` and `isSelector` are true", async () => {
    await createWrapper({ active: true, isSelector: true });

    const icon = screen.getByRole("img", {
      name: /error: passwords do not match/i,
    });
    expect(icon).toBeTruthy();
  });
});

// MARK: Visual & Responsive Styling

describe("Shield Visual & Responsive Styling", () => {
  it("applies responsive classes", async () => {
    await createWrapper({ isSelector: true });

    const label = screen.getByText("test-label");
    const labelWrapper = label.closest("div");

    // If small screen, add class.
    const classTokens = labelWrapper.classList;
    expect(classTokens.contains("max-sm:flex-grow")).toBeTruthy();
  });
});

// MARK: Accessibility

describe("Shield Accessibility", () => {
  it("component is focusable", async () => {
    const { container } = await createWrapper();

    const wrapper = container.querySelector('[tabindex="0"]') as HTMLElement;

    // It receives focus.
    await wrapper.focus();
    expect(document.activeElement).toBe(wrapper);
  });
});
