// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import BtnShareIcon from "../../../app/components/btn/BtnShareIcon.vue";
import render from "../../../test/render";

vi.mock("vue-socials", () => ({
  SEmail: { template: '<div data-testid="s-email"><slot /></div>' },
  SFacebook: { template: '<div data-testid="s-facebook"><slot /></div>' },
  STwitter: { template: '<div data-testid="s-twitter"><slot /></div>' },
  SMastodon: { template: '<div data-testid="s-mastodon"><slot /></div>' },
  STelegram: { template: '<div data-testid="s-telegram"><slot /></div>' },
  SFacebookMessenger: {
    template: '<div data-testid="s-facebook-messenger"><slot /></div>',
  },
}));

describe("BtnShareIcon", () => {
  const mockWriteText = vi.fn().mockResolvedValue(undefined);
  const mockOpen = vi.fn();
  const mockShowToastInfo = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("useToaster", () => ({
      showToastInfo: mockShowToastInfo,
    }));
    Object.defineProperty(navigator, "clipboard", {
      writable: true,
      value: {
        writeText: mockWriteText,
      },
    });
    window.open = mockOpen;
    vi.useFakeTimers();
    mockWriteText.mockClear();
    mockOpen.mockClear();
    mockShowToastInfo.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("vueSocials mode", () => {
    const props = {
      type: "vueSocials",
      socialComponent: "SEmail",
      iconName: "bi:envelope",
      text: "Email",
      iconSize: "1em",
    };

    it("renders vueSocials component", async () => {
      await render(BtnShareIcon, {
        props,
        global: {
          stubs: {
            MetaTagSocialMedia: true,
          },
        },
      });

      expect(screen.getByTestId("s-email")).toBeTruthy();
    });

    it("renders different social components", async () => {
      await render(BtnShareIcon, {
        props: { ...props, socialComponent: "STwitter" },
        global: {
          stubs: {
            MetaTagSocialMedia: true,
          },
        },
      });

      expect(screen.getByTestId("s-twitter")).toBeTruthy();
    });
  });

  describe("redirect mode", () => {
    const props = {
      type: "redirect",
      name: "signal",
      urlLink: "https://signal.me",
      redirectLink: "https://example.com",
      iconName: "bi:signal",
      text: "Signal",
      iconSize: "1em",
    };

    it("renders clickable div with button role", async () => {
      await render(BtnShareIcon, {
        props,
        global: {
          stubs: {
            MetaTagSocialMedia: true,
          },
        },
      });

      const button = screen.getByRole("button");
      expect(button).toBeTruthy();
      expect(button.getAttribute("tabindex")).toBe("0");
    });

    it("copies URL to clipboard and opens redirect link", async () => {
      await render(BtnShareIcon, {
        props: { ...props, text: "signal" },
        global: {
          stubs: {
            MetaTagSocialMedia: true,
          },
        },
      });

      const button = screen.getByRole("button");
      await fireEvent.click(button);

      // Wait for async clipboard operation
      await flushPromises();

      expect(mockWriteText).toHaveBeenCalledWith("https://signal.me");

      // Advance timers to trigger setTimeout
      vi.advanceTimersByTime(2000);
      await flushPromises();

      expect(mockOpen).toHaveBeenCalledWith("https://example.com", "_blank");
    });

    it("copies URL to clipboard without redirect link", async () => {
      await render(BtnShareIcon, {
        props: {
          type: "redirect",
          name: "signal",
          urlLink: "https://signal.me",
          iconName: "bi:signal",
          text: "Signal",
          iconSize: "1em",
        },
        global: {
          stubs: {
            MetaTagSocialMedia: true,
          },
        },
      });

      const button = screen.getByRole("button");
      await fireEvent.click(button);

      expect(mockWriteText).toHaveBeenCalledWith("https://signal.me");
      expect(mockShowToastInfo).not.toHaveBeenCalled();

      vi.advanceTimersByTime(2000);
      await flushPromises();

      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("handles keyboard interactions", async () => {
      await render(BtnShareIcon, {
        props,
        global: {
          stubs: {
            MetaTagSocialMedia: true,
          },
        },
      });

      const button = screen.getByRole("button");
      await fireEvent.keyPress(button, { key: "Enter", code: "Enter" });

      expect(mockWriteText).toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("handles clipboard errors gracefully", async () => {
      mockWriteText.mockRejectedValue(new Error("Clipboard error"));

      await render(BtnShareIcon, {
        props: {
          type: "redirect",
          name: "signal",
          urlLink: "https://signal.me",
          iconName: "bi:signal",
          text: "Signal",
        },
        global: {
          stubs: {
            MetaTagSocialMedia: true,
          },
        },
      });

      const button = screen.getByRole("button");
      await fireEvent.click(button);

      expect(mockOpen).not.toHaveBeenCalled();
      expect(mockShowToastInfo).not.toHaveBeenCalled();
    });
  });
});
