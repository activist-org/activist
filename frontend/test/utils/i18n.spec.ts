// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import { getLocaleText, getEnglishText } from "../../app/utils/i18n";
import { LOCALE_CODE } from "../../app/utils/locales";

describe("utils/i18n", () => {
  // MARK: - Basic Functionality

  it("getLocaleText returns en as default and correct map for specific code", () => {
    const en = getLocaleText();
    expect(typeof en).toBe("object");

    const fr = getLocaleText(LOCALE_CODE.FRENCH);
    expect(typeof fr).toBe("object");
    // ensure different locale maps are not empty
    expect(Object.keys(en).length).toBeGreaterThan(0);
    expect(Object.keys(fr).length).toBeGreaterThan(0);
  });

  it("getLocaleText defaults to English when no locale provided", () => {
    const defaultLocale = getLocaleText();
    const englishLocale = getLocaleText(LOCALE_CODE.ENGLISH);
    expect(defaultLocale).toEqual(englishLocale);
  });

  // MARK: - Locale Support

  it("getLocaleText returns objects for all supported locales", () => {
    const supportedLocales = [
      LOCALE_CODE.ENGLISH,
      LOCALE_CODE.ARABIC,
      LOCALE_CODE.FRENCH,
      LOCALE_CODE.GERMAN,
      LOCALE_CODE.ITALIAN,
      LOCALE_CODE.PORTUGUESE,
      LOCALE_CODE.SPANISH,
    ];

    for (const locale of supportedLocales) {
      const localeText = getLocaleText(locale);
      expect(typeof localeText).toBe("object");
      expect(Object.keys(localeText).length).toBeGreaterThan(0);
    }
  });

  it("all locale files contain string key-value pairs", () => {
    const locales = [
      LOCALE_CODE.ENGLISH,
      LOCALE_CODE.FRENCH,
      LOCALE_CODE.GERMAN,
    ];

    for (const locale of locales) {
      const localeText = getLocaleText(locale);
      for (const [key, value] of Object.entries(localeText)) {
        expect(typeof key).toBe("string");
        // Value can be string or object (for nested translations)
        expect(["string", "object"]).toContain(typeof value);
      }
    }
  });

  it("getEnglishText returns translation for valid key", () => {
    const englishLocale = getLocaleText(LOCALE_CODE.ENGLISH);
    const firstKey = Object.keys(englishLocale)[0];

    if (firstKey) {
      const result = getEnglishText(firstKey);
      expect(result).toBeDefined();
    }
  });

  it("different locales have different translations", () => {
    const en = getLocaleText(LOCALE_CODE.ENGLISH);
    const fr = getLocaleText(LOCALE_CODE.FRENCH);

    // Locales should not be identical
    expect(en).not.toEqual(fr);
  });

  it("all locale objects are non-null and non-empty", () => {
    const locales = [
      LOCALE_CODE.ENGLISH,
      LOCALE_CODE.ARABIC,
      LOCALE_CODE.FRENCH,
      LOCALE_CODE.GERMAN,
      LOCALE_CODE.ITALIAN,
      LOCALE_CODE.PORTUGUESE,
      LOCALE_CODE.SPANISH,
    ];

    for (const locale of locales) {
      const localeText = getLocaleText(locale);
      expect(localeText).not.toBeNull();
      expect(localeText).not.toBeUndefined();
      expect(Object.keys(localeText).length).toBeGreaterThan(0);
    }
  });

  // MARK: - Edge Cases

  it("getLocaleText returns undefined for invalid locale code", () => {
    // TypeScript prevents invalid codes at compile time, but test runtime behavior
    const invalidLocale =
      "invalid-code" as unknown as typeof LOCALE_CODE.ENGLISH;
    const result = getLocaleText(invalidLocale);
    // Invalid locale codes return undefined (no fallback)
    expect(result).toBeUndefined();
  });

  it("getEnglishText returns undefined for non-existent keys", () => {
    const result = getEnglishText("non.existent.key.that.does.not.exist");
    expect(result).toBeUndefined();
  });

  it("getEnglishText handles empty string key", () => {
    const result = getEnglishText("");
    expect(result).toBeUndefined();
  });

  it("getEnglishText handles nested translation keys", () => {
    const englishLocale = getLocaleText(LOCALE_CODE.ENGLISH);
    const keys = Object.keys(englishLocale);

    // Find a key that might have nested structure
    for (const key of keys) {
      const value = englishLocale[key];
      if (typeof value === "object" && value !== null) {
        const result = getEnglishText(key);
        expect(result).toBeDefined();
        break;
      }
    }
  });

  it("getLocaleText with undefined returns English", () => {
    const result = getLocaleText(undefined);
    const english = getLocaleText(LOCALE_CODE.ENGLISH);
    expect(result).toEqual(english);
  });

  it("all supported locales have consistent key structure", () => {
    const english = getLocaleText(LOCALE_CODE.ENGLISH);
    const englishKeys = Object.keys(english);

    const locales = [
      LOCALE_CODE.FRENCH,
      LOCALE_CODE.GERMAN,
      LOCALE_CODE.SPANISH,
    ];

    for (const locale of locales) {
      const localeText = getLocaleText(locale);
      const localeKeys = Object.keys(localeText);

      // Each locale should have some keys (not necessarily all the same)
      expect(localeKeys.length).toBeGreaterThan(0);

      // Check that there's some overlap in keys
      const commonKeys = englishKeys.filter((key) => localeKeys.includes(key));
      expect(commonKeys.length).toBeGreaterThan(0);
    }
  });

  it("locale text values are not empty strings", () => {
    const english = getLocaleText(LOCALE_CODE.ENGLISH);

    for (const [_key, value] of Object.entries(english)) {
      if (typeof value === "string") {
        expect(value.length).toBeGreaterThan(0);
      }
    }
  });
});
