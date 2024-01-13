export function getBtnDynamicClass(cta: boolean, fontSize: string) {
  return computed(() => ({
    "style-cta": cta === true,
    "style-cta-secondary": cta === false,
    "text-xs": fontSize === "xs",
    "text-sm": fontSize === "sm",
    "text-base": fontSize === "base",
    "text-lg": fontSize === "lg",
    "text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3": fontSize === "xl",
    "text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3": fontSize === "2xl",
    "text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3": fontSize === "3xl",
  }));
}
