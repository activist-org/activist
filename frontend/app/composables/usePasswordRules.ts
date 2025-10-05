// SPDX-License-Identifier: AGPL-3.0-or-later
export default function usePasswordRules() {
  type RuleFunctionsKey =
    | "number-of-chars"
    | "capital-letters"
    | "lower-case-letters"
    | "contains-numbers"
    | "contains-special-chars";

  const ruleFunctions: Record<RuleFunctionsKey, (value: string) => boolean> = {
    "number-of-chars": (value: string) => value.length >= 12,
    "capital-letters": (value: string) => /[A-Z]/.test(value),
    "lower-case-letters": (value: string) => /[a-z]/.test(value),
    "contains-numbers": (value: string) => /[0-9]/.test(value),
    "contains-special-chars": (value: string) => /[^a-zA-Z0-9]/.test(value),
  };

  const checkRules = (value: string) => {
    const rulesKeys = Object.keys(ruleFunctions);
    return rulesKeys.map((key) => ({
      isValid: ruleFunctions[key as RuleFunctionsKey](value),
      rule: key,
    }));
  };

  const isPasswordMatch = (
    passwordValue: string,
    confirmPasswordValue: string
  ) => {
    if (passwordValue === "" || confirmPasswordValue === "") {
      return false;
    }
    return passwordValue === confirmPasswordValue;
  };

  const isAllRulesValid = (value: string) => {
    const rulesKeys = Object.keys(ruleFunctions);
    return rulesKeys.every((key) =>
      ruleFunctions[key as RuleFunctionsKey](value)
    );
  };

  return { checkRules, isAllRulesValid, isPasswordMatch };
}
