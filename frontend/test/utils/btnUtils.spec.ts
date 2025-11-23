// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import { getBtnDynamicClass } from "../../shared/utils/btnUtils";

describe("utils/btnUtils", () => {
  describe("getBtnDynamicClass", () => {
    it("returns an object", () => {
      const result = getBtnDynamicClass(true, "base");
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });

    // MARK: CTA Flag Behavior
    describe("CTA flag behavior", () => {
      it("sets style-cta to true when cta is true", () => {
        const result = getBtnDynamicClass(true, "base");
        expect(result).toMatchObject({
          "style-cta": true,
          "style-cta-secondary": false,
        });
      });

      it("sets style-cta-secondary to true when cta is false", () => {
        const result = getBtnDynamicClass(false, "base");
        expect(result).toMatchObject({
          "style-cta": false,
          "style-cta-secondary": true,
        });
      });
    });

    // MARK: Font Size Classes
    describe("font size classes", () => {
      it("applies text-xs class for xs font size", () => {
        const result = getBtnDynamicClass(true, "xs");
        expect(result).toMatchObject({
          "text-xs": true,
        });
        // Verify other font sizes are false.
        expect(result["text-sm"]).toBe(false);
        expect(result["text-base"]).toBe(false);
        expect(result["text-lg"]).toBe(false);
      });

      it("applies text-sm class for sm font size", () => {
        const result = getBtnDynamicClass(true, "sm");
        expect(result).toMatchObject({
          "text-sm": true,
        });
        expect(result["text-xs"]).toBe(false);
        expect(result["text-base"]).toBe(false);
      });

      it("applies text-base class for base font size", () => {
        const result = getBtnDynamicClass(true, "base");
        expect(result).toMatchObject({
          "text-base": true,
        });
        expect(result["text-sm"]).toBe(false);
        expect(result["text-lg"]).toBe(false);
      });

      it("applies text-lg class for lg font size", () => {
        const result = getBtnDynamicClass(true, "lg");
        expect(result).toMatchObject({
          "text-lg": true,
        });
        expect(result["text-base"]).toBe(false);
      });

      it("applies responsive classes for xl font size", () => {
        const result = getBtnDynamicClass(true, "xl");
        expect(result).toMatchObject({
          "text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3": true,
        });
        expect(result["text-base"]).toBe(false);
        expect(result["text-lg"]).toBe(false);
      });

      it("applies responsive classes for 2xl font size", () => {
        const result = getBtnDynamicClass(true, "2xl");
        expect(result).toMatchObject({
          "text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3": true,
        });
        expect(result["text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3"]).toBe(
          false
        );
      });

      it("applies responsive classes for 3xl font size", () => {
        const result = getBtnDynamicClass(true, "3xl");
        expect(result).toMatchObject({
          "text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3": true,
        });
        expect(result["text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3"]).toBe(
          false
        );
      });
    });

    // MARK: Combined Behavior
    describe("combined behavior", () => {
      it("combines CTA true with base font size correctly", () => {
        const result = getBtnDynamicClass(true, "base");
        expect(result).toMatchObject({
          "style-cta": true,
          "style-cta-secondary": false,
          "text-base": true,
        });
      });

      it("combines CTA false with xl font size correctly", () => {
        const result = getBtnDynamicClass(false, "xl");
        expect(result).toMatchObject({
          "style-cta": false,
          "style-cta-secondary": true,
          "text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3": true,
        });
      });

      it("combines CTA true with 2xl font size correctly", () => {
        const result = getBtnDynamicClass(true, "2xl");
        expect(result).toMatchObject({
          "style-cta": true,
          "style-cta-secondary": false,
          "text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3": true,
        });
      });

      // Keep the original merged test case from feat/services-unit-tests branch.
      it("returns classes for cta and font sizes", () => {
        const small = getBtnDynamicClass(true, "sm") as Record<string, boolean>;
        expect(small["style-cta"]).toBe(true);
        expect(small["style-cta-secondary"]).toBe(false);
        expect(small["text-sm"]).toBe(true);

        const xl = getBtnDynamicClass(false, "xl") as Record<string, boolean>;
        expect(xl["style-cta"]).toBe(false);
        expect(xl["style-cta-secondary"]).toBe(true);
        expect(xl["text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3"]).toBe(
          true
        );
      });
    });

    // MARK: Edge Cases
    describe("edge cases", () => {
      const fontSizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"] as const;

      fontSizes.forEach((fontSize) => {
        it(`CTA true with ${fontSize} font size has only one font size class true`, () => {
          const result = getBtnDynamicClass(true, fontSize);

          const fontSizeKeys = [
            "text-xs",
            "text-sm",
            "text-base",
            "text-lg",
            "text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3",
            "text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3",
            "text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3",
          ];

          const trueClasses = fontSizeKeys.filter(
            (key) => result[key as keyof typeof result]
          );
          expect(trueClasses).toHaveLength(1);
        });

        it(`CTA false with ${fontSize} font size has only one font size class true`, () => {
          const result = getBtnDynamicClass(false, fontSize);

          const fontSizeKeys = [
            "text-xs",
            "text-sm",
            "text-base",
            "text-lg",
            "text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3",
            "text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3",
            "text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3",
          ];

          const trueClasses = fontSizeKeys.filter(
            (key) => result[key as keyof typeof result]
          );
          expect(trueClasses).toHaveLength(1);
        });
      });

      fontSizes.forEach((fontSize) => {
        it(`CTA classes are mutually exclusive with ${fontSize} font size (CTA true)`, () => {
          const result = getBtnDynamicClass(true, fontSize);

          expect(result["style-cta"]).toBe(true);
          expect(result["style-cta-secondary"]).toBe(false);
        });

        it(`CTA classes are mutually exclusive with ${fontSize} font size (CTA false)`, () => {
          const result = getBtnDynamicClass(false, fontSize);

          expect(result["style-cta"]).toBe(false);
          expect(result["style-cta-secondary"]).toBe(true);
        });
      });
    });
  });
});
