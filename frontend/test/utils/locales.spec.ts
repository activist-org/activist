// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import locales, { LOCALE_CODE, LOCALE_NAME } from "../../app/utils/locales";

describe("utils/locales", () => {
  // MARK: - Locale Codes and Names

  it("exports expected locale codes and names", () => {
    const codes = locales.map((l) => l.code);
    expect(codes).toEqual([
      LOCALE_CODE.ARABIC,
      LOCALE_CODE.ENGLISH,
      LOCALE_CODE.FRENCH,
      LOCALE_CODE.GERMAN,
      LOCALE_CODE.ITALIAN,
      LOCALE_CODE.PORTUGUESE,
      LOCALE_CODE.SPANISH,
    ]);
    expect(locales.find((l) => l.code === LOCALE_CODE.ENGLISH)!.name).toBe(
      LOCALE_NAME.ENGLISH
    );
  });

  // MARK: - Translation Files

  it("has translation files assigned", () => {
    for (const l of locales) {
      expect(l.file).toBeDefined();
      if (typeof l.file === "string") {
        expect(l.file.endsWith(".json")).toBe(true);
      }
    }
  });
});
