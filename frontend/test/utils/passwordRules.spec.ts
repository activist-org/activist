// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import { passwordRules } from "../../app/constants/passwordRules";

describe("utils/passwordRules", () => {
  // MARK: Structure

  it("exports five default rules in correct order", () => {
    expect(Array.isArray(passwordRules)).toBe(true);
    expect(passwordRules).toHaveLength(5);
    expect(passwordRules.map((r) => r.message)).toEqual([
      "number-of-chars",
      "capital-letters",
      "lower-case-letters",
      "contains-numbers",
      "contains-special-chars",
    ]);
  });

  it("defaults all isValid to false", () => {
    for (const rule of passwordRules) {
      expect(rule.isValid).toBe(false);
    }
  });

  // MARK: Validation

  it("each rule has required properties", () => {
    for (const rule of passwordRules) {
      expect(rule).toHaveProperty("isValid");
      expect(rule).toHaveProperty("message");
      expect(typeof rule.isValid).toBe("boolean");
      expect(typeof rule.message).toBe("string");
    }
  });

  it("rule messages are unique", () => {
    const messages = passwordRules.map((r) => r.message);
    const uniqueMessages = new Set(messages);
    expect(uniqueMessages.size).toBe(messages.length);
  });

  it("exports specific rules in expected positions", () => {
    expect(passwordRules[0].message).toBe("number-of-chars");
    expect(passwordRules[1].message).toBe("capital-letters");
    expect(passwordRules[2].message).toBe("lower-case-letters");
    expect(passwordRules[3].message).toBe("contains-numbers");
    expect(passwordRules[4].message).toBe("contains-special-chars");
  });

  it("rule array is not empty", () => {
    expect(passwordRules.length).toBeGreaterThan(0);
  });

  it("all rule messages are non-empty strings", () => {
    for (const rule of passwordRules) {
      expect(rule.message.length).toBeGreaterThan(0);
      expect(rule.message.trim()).toBe(rule.message);
    }
  });
});
