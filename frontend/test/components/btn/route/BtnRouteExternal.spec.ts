// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import BtnRouteExternal from "../../../../app/components/btn/route/BtnRouteExternal.vue";
import { renderButton } from "../helpers";

describe("BtnRouteExternal", () => {
  const defaultProps = {
    cta: true,
    fontSize: "base" as const,
    ariaLabel: "i18n.test.external",
    linkTo: "https://example.com",
  };

  it("renders anchor element with href and target", async () => {
    await renderButton(BtnRouteExternal, defaultProps);

    const link = screen.getByRole("link");
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("https://example.com");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  it("applies style-cta class when cta is true", async () => {
    await renderButton(BtnRouteExternal, { ...defaultProps, cta: true });

    const link = screen.getByRole("link");
    expect(link.className).toContain("style-cta");
  });

  it("applies style-cta-secondary class when cta is false", async () => {
    await renderButton(BtnRouteExternal, { ...defaultProps, cta: false });

    const link = screen.getByRole("link");
    expect(link.className).toContain("style-cta-secondary");
  });

  it("applies responsive classes for xl font size", async () => {
    await renderButton(BtnRouteExternal, { ...defaultProps, fontSize: "xl" });

    const link = screen.getByRole("link");
    expect(link.className).toContain("text-base");
    expect(link.className).toContain("xl:text-xl");
  });
});
