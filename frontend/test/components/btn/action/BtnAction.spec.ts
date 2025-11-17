// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import BtnAction from "../../../../app/components/btn/action/BtnAction.vue";
import { renderButton } from "../helpers";

describe("BtnAction", () => {
  const defaultProps = {
    cta: true,
    fontSize: "base" as const,
    ariaLabel: "i18n.test.button",
  };

  it("renders button with aria-label", async () => {
    await renderButton(BtnAction, defaultProps);

    const button = screen.getByRole("button");
    expect(button).toBeTruthy();
    expect(button.getAttribute("aria-label")).toBeDefined();
  });

  it("applies style-cta class when cta is true", async () => {
    await renderButton(BtnAction, { ...defaultProps, cta: true });

    const button = screen.getByRole("button");
    expect(button.className).toContain("style-cta");
  });

  it("applies style-cta-secondary class when cta is false", async () => {
    await renderButton(BtnAction, { ...defaultProps, cta: false });

    const button = screen.getByRole("button");
    expect(button.className).toContain("style-cta-secondary");
  });

  it("applies font size classes correctly", async () => {
    const fontSizeTests = [
      { fontSize: "xs", expected: "text-xs" },
      { fontSize: "sm", expected: "text-sm" },
      { fontSize: "base", expected: "text-base" },
      { fontSize: "lg", expected: "text-lg" },
    ];

    for (const { fontSize, expected } of fontSizeTests) {
      await renderButton(BtnAction, { ...defaultProps, fontSize });

      const button = screen.getByRole("button");
      expect(button.className).toContain(expected);
    }
  });

  it("applies responsive classes for xl font size", async () => {
    await renderButton(BtnAction, { ...defaultProps, fontSize: "xl" });

    const button = screen.getByRole("button");
    expect(button.className).toContain("text-base");
    expect(button.className).toContain("sm:text-lg");
    expect(button.className).toContain("xl:text-xl");
  });

  it("applies id when provided", async () => {
    await renderButton(BtnAction, { ...defaultProps, id: "test-button" });

    const button = screen.getByRole("button");
    expect(button.getAttribute("id")).toBe("test-button");
  });
});
