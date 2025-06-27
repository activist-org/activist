// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "~/utils/i18n";

export const PASSWORD_RATING = {
  INVALID: getEnglishText(
    "i18n._global.invalid"
  ),
  VERY_WEAK: getEnglishText(
    "i18n._global.very_weak"
  ),
  WEAK: getEnglishText("i18n._global.weak"),
  MEDIUM: getEnglishText("i18n._global.medium"),
  STRONG: getEnglishText("i18n._global.strong"),
  VERY_STRONG: getEnglishText(
    "i18n._global.very_strong"
  ),
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
