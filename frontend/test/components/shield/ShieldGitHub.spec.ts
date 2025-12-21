// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import ShieldGitHub from "../../../app/components/shield/ShieldGitHub.vue";
import render from "../../../test/render";

type ShieldGitHubProps = {
  text?: string;
  count?: number;
  isLoading: boolean;
  href: string;
};

const createWrapper = async (props: Partial<ShieldGitHubProps> = {}) =>
  await render(ShieldGitHub, {
    props: {
      isLoading: false,
      href: "https://test-url.com",
      ...props,
    },
    slots: {
      default: () => "Test link name",
    },
  });

// MARK: Basic Rendering

describe("Shield GitHub Basic Rendering", () => {
  it("renders link correctly", async () => {
    await createWrapper();

    // Link exists and renders slot correctly.
    const link = screen.getByRole("link", { name: /test link name/i });
    expect(link).toBeTruthy();

    // Link URL is correct and opens in new tab.
    expect(link.getAttribute("href")).toBe("https://test-url.com");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  it("renders `isLoading` if true", async () => {
    await createWrapper({ isLoading: true });

    const loading = document.querySelector(".animate-pulse");
    expect(loading).toBeTruthy();
  });

  it("renders `text` if exists", async () => {
    await createWrapper({ text: "test text" });

    const text = screen.getByText("test text");
    expect(text).toBeTruthy();
  });

  it("renders `count` if exists", async () => {
    await createWrapper({ count: 3 });

    const count = screen.getByText(3);
    expect(count).toBeTruthy();
  });
});

// MARK: Visual & Responsive Styling

describe("Shield GitHub Visual & Responsive Styling", () => {
  it("applies responsive classes", async () => {
    await createWrapper({ isLoading: true, text: "test text", count: 3 });

    // Responsive classes for `href`.
    const link = screen.getByRole("link", { name: /test link name/i });
    const linkClasses = link.classList;
    // Responsive border radius.
    expect(linkClasses.contains("rounded-md")).toBeTruthy();
    expect(linkClasses.contains("sm:rounded-lg")).toBeTruthy();

    // Responsive classes if `isLoading` is true.
    const loading = document.querySelector(".animate-pulse");
    const isLoadingClasses = loading.classList;
    // Responsive text size
    expect(isLoadingClasses.contains("text-xl")).toBeTruthy();
    expect(isLoadingClasses.contains("md:text-2xl")).toBeTruthy();

    // Responsive classes for `text`.
    const text = screen.getByText("test text");
    const textClasses = text.classList;

    // Responsive text size.
    expect(textClasses.contains("text-lg")).toBeTruthy();
    expect(textClasses.contains("md:text-xl")).toBeTruthy();

    // Responsive classes for `count`.
    const count = screen.getByText(3);
    const countClasses = count.classList;

    // Responsive height and width.
    const expectedClasses = ["h-9", "md:h-10", "w-9", "md:w-10"];
    expectedClasses.forEach((className) => {
      expect(countClasses.contains(className)).toBeTruthy();
    });
  });
});
