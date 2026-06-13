// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "../shared/utils/i18n";
export const PASSWORD_RATING = {
  INVALID: getEnglishText(
    "i18n.components.indicator_password_strength.invalid"
  ),
  // * Note: This is a placeholder until getEnglishText can receive params for dynamic text.
  VERY_WEAK: "Time to crack password: less than a second",
  WEAK: "Time to crack password: 17 minutes",
  MEDIUM: "Time to crack password: 15 days",
  STRONG: "Time to crack password: 9 years",
  VERY_STRONG: "Time to crack password: centuries",
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
