// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import BtnTag from "../../../app/components/btn/BtnTag.vue";
import { renderButton } from "./helpers";

describe("BtnTag", () => {
  const defaultProps = {
    cta: true,
    fontSize: "base" as const,
    ariaLabel: "i18n.test.button",
  };

  it("renders button with aria-label", async () => {
    await renderButton(BtnTag, defaultProps);

    const button = screen.getByRole("button");
    expect(button).toBeTruthy();
    expect(button.getAttribute("aria-label")).toBeDefined();
  });

  it("applies gray background when cta is false", async () => {
    await renderButton(BtnTag, { ...defaultProps, cta: false });

    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-[#C8C8C8]");
    expect(button.className).toContain("hover:bg-[#C8C8C8]/70");
  });

  it("does not apply gray background when cta is true", async () => {
    await renderButton(BtnTag, { ...defaultProps, cta: true });

    const button = screen.getByRole("button");
    expect(button.className).not.toContain("bg-[#C8C8C8]");
  });

  it("applies font size classes correctly", async () => {
    const fontSizeTests = [
      { fontSize: "xs", expected: "text-xs" },
      { fontSize: "sm", expected: "text-sm" },
      { fontSize: "base", expected: "text-base" },
      { fontSize: "lg", expected: "text-lg" },
    ];

    for (const { fontSize, expected } of fontSizeTests) {
      await renderButton(BtnTag, { ...defaultProps, fontSize });

      const button = screen.getByRole("button");
      expect(button.className).toContain(expected);
    }
  });

  it("applies responsive classes for xl font size", async () => {
    await renderButton(BtnTag, { ...defaultProps, fontSize: "xl" });

    const button = screen.getByRole("button");
    expect(button.className).toContain("text-base");
    expect(button.className).toContain("xl:text-xl");
  });
});
