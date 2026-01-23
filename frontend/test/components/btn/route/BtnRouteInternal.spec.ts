// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Demonstrate overriding composable mocks with spy for call tracking.
 * - Pattern 3: Override with spy for call tracking.
 * - Uses vi.stubGlobal directly since we need a spy function to verify calls.
 */
import { screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BtnRouteInternal from "../../../../app/components/btn/route/BtnRouteInternal.vue";
import { renderButton } from "../helpers";

describe("BtnRouteInternal", () => {
  // Create a spy function for useLocalePath to track calls for verification.
  const mockLocalePath = vi.fn((path: string) => `/en${path}`);

  beforeEach(() => {
    // Pattern 3: Override with spy for call tracking.
    // We use vi.stubGlobal directly since we need a spy function to verify calls.
    // The factory could be used for default behavior, but here we need call tracking.
    vi.stubGlobal("useLocalePath", () => mockLocalePath);
    mockLocalePath.mockClear();
  });

  const defaultProps = {
    cta: true,
    fontSize: "base" as const,
    ariaLabel: "i18n.test.link",
    linkTo: "/test-page",
  };

  const nuxtLinkStub = {
    template:
      '<a data-testid="nuxt-link" :to="to" :class="$attrs.class"><slot /></a>',
    props: ["to"],
  };

  it("renders NuxtLink with localized path", async () => {
    await renderButton(BtnRouteInternal, defaultProps, {
      NuxtLink: nuxtLinkStub,
    });

    expect(screen.getByTestId("nuxt-link")).toBeTruthy();
    expect(mockLocalePath).toHaveBeenCalledWith("/test-page");
  });

  it("applies style-cta class when cta is true", async () => {
    await renderButton(
      BtnRouteInternal,
      { ...defaultProps, cta: true },
      { NuxtLink: nuxtLinkStub }
    );

    const link = screen.getByTestId("nuxt-link");
    expect(link.className).toContain("style-cta");
  });

  it("applies style-cta-secondary class when cta is false", async () => {
    await renderButton(
      BtnRouteInternal,
      { ...defaultProps, cta: false },
      { NuxtLink: nuxtLinkStub }
    );

    const link = screen.getByTestId("nuxt-link");
    expect(link.className).toContain("style-cta-secondary");
  });

  it("applies responsive classes for xl font size", async () => {
    await renderButton(
      BtnRouteInternal,
      { ...defaultProps, fontSize: "xl" },
      { NuxtLink: nuxtLinkStub }
    );

    const link = screen.getByTestId("nuxt-link");
    expect(link.className).toContain("text-base");
    expect(link.className).toContain("xl:text-xl");
  });
});
