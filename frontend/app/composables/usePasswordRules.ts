// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Composable for validating password rules and checking password match in the frontend application. This composable provides functions to check if a given password meets specific rules (such as minimum length, presence of capital letters, etc.), to verify if two password values match (e.g., password and confirm password fields), and to determine if all password rules are valid for a given password value. The composable returns these functions for use in components that require password validation logic, such as registration or password reset forms.
 * @returns An object containing functions for checking password rules,
 * validating if all rules are met, and verifying if two password values match, which can be used in components that require password validation functionality.
 */
export default function usePasswordRules() {
  const ruleFunctions: Record<RuleFunctionsKey, (value: string) => boolean> = {
    "number-of-chars": (value: string) => value.length >= 12,
    "capital-letters": (value: string) => /[A-Z]/.test(value),
    "lower-case-letters": (value: string) => /[a-z]/.test(value),
    "contains-numbers": (value: string) => /[0-9]/.test(value),
    "contains-special-chars": (value: string) => /[^a-zA-Z0-9]/.test(value),
  };

  const checkRules = (value: string): PasswordRules[] => {
    const rulesKeys = Object.keys(ruleFunctions);
    return rulesKeys.map((key) => ({
      isValid: ruleFunctions[key as RuleFunctionsKey](value),
      rule: key as RuleFunctionsKey,
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
