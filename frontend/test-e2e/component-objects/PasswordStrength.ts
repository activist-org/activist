// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";
import { expect } from "playwright/test";

export const PASSWORD_RATING = {
  INVALID: /invalid/i,
  VERY_WEAK: /very weak/i,
  WEAK: /weak/i,
  MEDIUM: /medium/i,
  STRONG: /strong/i,
  VERY_STRONG: /very strong/i,
};

export const PASSWORD_PROGRESS = {
  P20: /width: 20%/,
  P40: /width: 40%/,
  P60: /width: 60%/,
  P80: /width: 80%/,
  P100: /width: 100/,
};

export const PASSWORD_STRENGTH_COLOR: Record<string, RegExp | ""> = {
  NONE: "",
  RED: /bg-password-strength-very-weak/,
  ORANGE: /bg-password-strength-weak/,
  YELLOW: /bg-password-strength-medium/,
  GREEN: /bg-password-strength-strong/,
  PRIMARY_TEXT: /bg-primary-text/,
};

export const newPasswordStrength = (parent: Page | Locator) => {
  const progressBar = parent.locator("#password-strength-indicator-progress");

  return {
    parent,
    progressBar,
    text: parent.locator("#sign-in-password-strength-text"),
    expectProgress: async (percentage: RegExp) => {
      await expect(progressBar).toHaveAttribute("style", percentage);
    },
    expectColor: async (color: RegExp | "") => {
      if (color === "") {
        await expect(progressBar).not.toHaveClass(/bg/);
      } else {
        await expect(progressBar).toHaveClass(color);
      }
    },
  };
};
