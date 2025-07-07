// SPDX-License-Identifier: AGPL-3.0-or-later
export function getBtnDynamicClass(
  cta: boolean,
  fontSize: string,
  isDisabled: boolean
) {
  return computed(() => ({
    "style-cta": cta && !isDisabled,
    "style-cta-secondary": !cta && !isDisabled,
    "style-cta-disabled": cta && isDisabled,
    "style-cta-secondary-disabled": !cta && isDisabled,
    "text-xs": fontSize === "xs",
    "text-sm": fontSize === "sm",
    "text-base": fontSize === "base",
    "text-lg": fontSize === "lg",
    "text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3": fontSize === "xl",
    "text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3": fontSize === "2xl",
    "text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3": fontSize === "3xl",
  }));
}
