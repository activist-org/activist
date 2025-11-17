// SPDX-License-Identifier: AGPL-3.0-or-later
export type RuleFunctionsKey =
  | "number-of-chars"
  | "capital-letters"
  | "lower-case-letters"
  | "contains-numbers"
  | "contains-special-chars";

export interface PasswordRules {
  isValid: boolean;
  rule: RuleFunctionsKey;
}
