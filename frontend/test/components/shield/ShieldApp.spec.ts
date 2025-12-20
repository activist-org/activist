// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import ShieldApp from "../../../app/components/shield/ShieldApp.vue";
import render from "../../../test/render";

// Shield App Basic Rendering

describe("Shield App Basic Rendering", () => {
  it("renders link correctly", async () => {
    await render(ShieldApp, {
      props: { href: "https://test-url.com" },
      slots: {
        default: () => "Test link name",
      },
    });

    // Link exists and renders slot correctly
    const link = screen.getByRole("link", { name: /test link name/i });
    expect(link).toBeTruthy();

    // Link URL is correct and opens in new tab
    expect(link.getAttribute("href")).toBe("https://test-url.com");
    expect(link.getAttribute("target")).toBe("_blank");
  });
});
