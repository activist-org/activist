// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import usePasswordRules from "../../app/composables/usePasswordRules";

describe("usePasswordRules composable", () => {
  const { checkRules, isAllRulesValid, isPasswordMatch } = usePasswordRules();

  // MARK: checkRules

  describe("checkRules", () => {
    it("returns validation results for all rules", () => {
      const password = "ValidPass123!";
      const results = checkRules(password);

      expect(results).toHaveLength(5);
      expect(results.every((r) => "isValid" in r && "rule" in r)).toBe(true);
    });

    it("validates number-of-chars rule correctly", () => {
      const results = checkRules("Short1!");
      const rule = results.find((r) => r.rule === "number-of-chars");

      expect(rule).toBeDefined();
      expect(rule!.isValid).toBe(false);
    });

    it("validates capital-letters rule correctly", () => {
      const resultsValid = checkRules("HasCapital123!");
      const resultsInvalid = checkRules("nocapital123!");

      const validRule = resultsValid.find((r) => r.rule === "capital-letters");
      const invalidRule = resultsInvalid.find(
        (r) => r.rule === "capital-letters"
      );

      expect(validRule!.isValid).toBe(true);
      expect(invalidRule!.isValid).toBe(false);
    });

    it("validates lower-case-letters rule correctly", () => {
      const resultsValid = checkRules("HASLowerCase123!");
      const resultsInvalid = checkRules("ALLUPPER123!");

      const validRule = resultsValid.find(
        (r) => r.rule === "lower-case-letters"
      );
      const invalidRule = resultsInvalid.find(
        (r) => r.rule === "lower-case-letters"
      );

      expect(validRule!.isValid).toBe(true);
      expect(invalidRule!.isValid).toBe(false);
    });

    it("validates contains-numbers rule correctly", () => {
      const resultsValid = checkRules("ValidPass123!");
      const resultsInvalid = checkRules("NoNumbers!!");

      const validRule = resultsValid.find((r) => r.rule === "contains-numbers");
      const invalidRule = resultsInvalid.find(
        (r) => r.rule === "contains-numbers"
      );

      expect(validRule!.isValid).toBe(true);
      expect(invalidRule!.isValid).toBe(false);
    });

    it("validates contains-special-chars rule correctly", () => {
      const resultsValid = checkRules("ValidPass123!");
      const resultsInvalid = checkRules("NoSpecialChars123");

      const validRule = resultsValid.find(
        (r) => r.rule === "contains-special-chars"
      );
      const invalidRule = resultsInvalid.find(
        (r) => r.rule === "contains-special-chars"
      );

      expect(validRule!.isValid).toBe(true);
      expect(invalidRule!.isValid).toBe(false);
    });

    it("handles empty string", () => {
      const results = checkRules("");

      expect(results).toHaveLength(5);
      expect(results.every((r) => r.isValid === false)).toBe(true);
    });

    it("handles password with exactly 12 characters", () => {
      const results = checkRules("ValidPass12!");
      const rule = results.find((r) => r.rule === "number-of-chars");

      expect(rule!.isValid).toBe(true);
    });

    it("handles password with 11 characters (boundary)", () => {
      const results = checkRules("ValidPas12!");
      const rule = results.find((r) => r.rule === "number-of-chars");

      expect(rule!.isValid).toBe(false);
    });

    it("handles various special characters", () => {
      const specialChars = [
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "-",
        "_",
        "+",
        "=",
        "[",
        "]",
        "{",
        "}",
        "|",
        "\\",
        ";",
        ":",
        "'",
        '"',
        ",",
        ".",
        "<",
        ">",
        "/",
        "?",
        "~",
        "`",
      ];

      specialChars.forEach((char) => {
        const results = checkRules(`ValidPass123${char}`);
        const rule = results.find((r) => r.rule === "contains-special-chars");

        expect(rule!.isValid).toBe(true);
      });
    });

    it("handles whitespace as special character", () => {
      const results = checkRules("Valid Pass 123");
      const rule = results.find((r) => r.rule === "contains-special-chars");

      expect(rule!.isValid).toBe(true);
    });

    it("handles unicode characters", () => {
      const results = checkRules("ValidPass123é");
      const rule = results.find((r) => r.rule === "contains-special-chars");

      // Non-ASCII characters should be treated as special chars.
      expect(rule!.isValid).toBe(true);
    });

    it("validates multiple numbers", () => {
      const results = checkRules("ValidPass123456!");
      const rule = results.find((r) => r.rule === "contains-numbers");

      expect(rule!.isValid).toBe(true);
    });

    it("validates multiple capital letters", () => {
      const results = checkRules("ABCDEFGH123!");
      const rule = results.find((r) => r.rule === "capital-letters");

      expect(rule!.isValid).toBe(true);
    });

    it("validates multiple lowercase letters", () => {
      const results = checkRules("abcdefgh123!");
      const rule = results.find((r) => r.rule === "lower-case-letters");

      expect(rule!.isValid).toBe(true);
    });
  });

  // MARK: isAllRulesValid

  describe("isAllRulesValid", () => {
    it("returns true for valid password with all rules satisfied", () => {
      const validPassword = "ValidPass123!";
      expect(isAllRulesValid(validPassword)).toBe(true);
    });

    it("returns false for password missing capital letters", () => {
      const invalidPassword = "validpass123!";
      expect(isAllRulesValid(invalidPassword)).toBe(false);
    });

    it("returns false for password missing lowercase letters", () => {
      const invalidPassword = "VALIDPASS123!";
      expect(isAllRulesValid(invalidPassword)).toBe(false);
    });

    it("returns false for password missing numbers", () => {
      const invalidPassword = "ValidPassword!";
      expect(isAllRulesValid(invalidPassword)).toBe(false);
    });

    it("returns false for password missing special characters", () => {
      const invalidPassword = "ValidPassword123";
      expect(isAllRulesValid(invalidPassword)).toBe(false);
    });

    it("returns false for password with less than 12 characters", () => {
      const invalidPassword = "Valid123!";
      expect(isAllRulesValid(invalidPassword)).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isAllRulesValid("")).toBe(false);
    });

    it("returns true for complex password with all requirements", () => {
      const complexPassword = "MySecureP@ssw0rd2023!";
      expect(isAllRulesValid(complexPassword)).toBe(true);
    });

    it("returns true for password with exactly 12 characters and all rules", () => {
      const password = "ValidPass12!";
      expect(isAllRulesValid(password)).toBe(true);
    });

    it("returns false for password with 11 characters but all other rules", () => {
      const password = "ValidPas12!";
      expect(isAllRulesValid(password)).toBe(false);
    });

    it("returns true for very long password with all rules", () => {
      const longPassword = "ThisIsAVeryLongPasswordThatSatisfiesAllRules123!@#";
      expect(isAllRulesValid(longPassword)).toBe(true);
    });

    it("handles password with multiple special characters", () => {
      const password = "ValidPass123!@#$%";
      expect(isAllRulesValid(password)).toBe(true);
    });

    it("handles password with whitespace", () => {
      const password = "Valid Pass 123!";
      expect(isAllRulesValid(password)).toBe(true);
    });
  });

  // MARK: isPasswordMatch

  describe("isPasswordMatch", () => {
    it("returns true when passwords match", () => {
      const password = "ValidPass123!";
      expect(isPasswordMatch(password, password)).toBe(true);
    });

    it("returns false when passwords do not match", () => {
      const password1 = "ValidPass123!";
      const password2 = "DifferentPass456!";
      expect(isPasswordMatch(password1, password2)).toBe(false);
    });

    it("returns false when first password is empty", () => {
      const password = "ValidPass123!";
      expect(isPasswordMatch("", password)).toBe(false);
    });

    it("returns false when second password is empty", () => {
      const password = "ValidPass123!";
      expect(isPasswordMatch(password, "")).toBe(false);
    });

    it("returns false when both passwords are empty", () => {
      expect(isPasswordMatch("", "")).toBe(false);
    });

    it("is case-sensitive", () => {
      const password1 = "ValidPass123!";
      const password2 = "validpass123!";
      expect(isPasswordMatch(password1, password2)).toBe(false);
    });

    it("handles whitespace differences", () => {
      const password1 = "Valid Pass123!";
      const password2 = "ValidPass123!";
      expect(isPasswordMatch(password1, password2)).toBe(false);
    });

    it("handles passwords with special characters", () => {
      const password = "P@ssw0rd!2023#Special";
      expect(isPasswordMatch(password, password)).toBe(true);
    });

    it("handles very long matching passwords", () => {
      const longPassword =
        "ThisIsAVeryLongPasswordWithLotsOfCharacters123!@#$%^&*()";
      expect(isPasswordMatch(longPassword, longPassword)).toBe(true);
    });

    it("detects single character difference", () => {
      const password1 = "ValidPass123!";
      const password2 = "ValidPass124!";
      expect(isPasswordMatch(password1, password2)).toBe(false);
    });

    it("handles unicode characters", () => {
      const password = "ValidPass123é!";
      expect(isPasswordMatch(password, password)).toBe(true);
    });

    it("handles passwords with only whitespace", () => {
      const password = "   ";
      expect(isPasswordMatch(password, password)).toBe(true);
    });
  });

  // MARK: Integration Tests

  describe("Integration scenarios", () => {
    it("validates a complete password creation flow", () => {
      const password = "SecureP@ssw0rd!";
      const confirmPassword = "SecureP@ssw0rd!";

      // Check all individual rules.
      const ruleResults = checkRules(password);
      expect(ruleResults.every((r) => r.isValid)).toBe(true);

      // Check overall validation.
      expect(isAllRulesValid(password)).toBe(true);

      // Check password match.
      expect(isPasswordMatch(password, confirmPassword)).toBe(true);
    });

    it("validates a failed password creation flow", () => {
      const password = "weak";
      const confirmPassword = "different";

      // Check all individual rules.
      const ruleResults = checkRules(password);
      expect(ruleResults.every((r) => r.isValid)).toBe(false);

      // Check overall validation.
      expect(isAllRulesValid(password)).toBe(false);

      // Check password match.
      expect(isPasswordMatch(password, confirmPassword)).toBe(false);
    });

    it("handles password that passes length but fails other rules", () => {
      const password = "passwordpassword"; // 16 chars but missing uppercase, numbers, special

      const ruleResults = checkRules(password);
      const lengthRule = ruleResults.find((r) => r.rule === "number-of-chars");
      const capitalRule = ruleResults.find((r) => r.rule === "capital-letters");

      expect(lengthRule!.isValid).toBe(true);
      expect(capitalRule!.isValid).toBe(false);
      expect(isAllRulesValid(password)).toBe(false);
    });

    it("provides detailed rule feedback for UI display", () => {
      const password = "Partial123";
      const results = checkRules(password);

      const feedback = results.map((r) => ({
        rule: r.rule,
        status: r.isValid ? "✓" : "✗",
      }));

      expect(feedback).toHaveLength(5);
      // Should have both passing and failing rules.
      expect(feedback.some((f) => f.status === "✓")).toBe(true);
      expect(feedback.some((f) => f.status === "✗")).toBe(true);
    });
  });

  // MARK: Edge Cases

  describe("Edge cases and error handling", () => {
    it("handles password with only numbers", () => {
      const password = "123456789012";
      expect(isAllRulesValid(password)).toBe(false);
    });

    it("handles password with only special characters", () => {
      const password = "!!!!!!!!!!!!";
      expect(isAllRulesValid(password)).toBe(false);
    });

    it("handles password with only letters", () => {
      const password = "OnlyLettersHere";
      expect(isAllRulesValid(password)).toBe(false);
    });

    it("handles null-like string values", () => {
      const results = checkRules("null");
      expect(results).toHaveLength(5);
    });

    it("handles undefined-like string values", () => {
      const results = checkRules("undefined");
      expect(results).toHaveLength(5);
    });

    it("handles passwords with leading/trailing spaces", () => {
      const password = " ValidPass123! ";
      const trimmedPassword = "ValidPass123!";

      expect(isPasswordMatch(password, trimmedPassword)).toBe(false);
    });

    it("handles extremely long passwords", () => {
      const extremelyLongPassword = "A".repeat(1000) + "a1!";
      expect(isAllRulesValid(extremelyLongPassword)).toBe(true);
    });

    it("handles password with emoji", () => {
      const password = "ValidPass123!😀";
      const results = checkRules(password);
      const specialCharsRule = results.find(
        (r) => r.rule === "contains-special-chars"
      );
      expect(specialCharsRule!.isValid).toBe(true);
    });
  });
});
