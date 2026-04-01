// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Utility function to generate dynamic class bindings for button components based on their "call to action" status and font size.
 * @param cta - Indicates whether the button is a call to action.
 * @param fontSize - The font size of the button text.
 * @returns An object containing the dynamic class bindings for the button component.
 */
export function getBtnDynamicClass(cta: boolean, fontSize: string) {
  return {
    "style-cta": cta,
    "style-cta-secondary": !cta,
    "text-xs": fontSize === "xs",
    "text-sm": fontSize === "sm",
    "text-base": fontSize === "base",
    "text-lg": fontSize === "lg",
    "text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3": fontSize === "xl",
    "text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3": fontSize === "2xl",
    "text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3": fontSize === "3xl",
  };
}
