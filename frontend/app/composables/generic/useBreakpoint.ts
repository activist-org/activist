// SPDX-License-Identifier: AGPL-3.0-or-later
import { useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints({
  sm: BreakpointMap.SMALL,
  md: BreakpointMap.MEDIUM,
  lg: BreakpointMap.LARGE,
  xl: BreakpointMap.XL,
  "2xl": BreakpointMap.XXL,
  xxl: BreakpointMap.XXL,
  "3xl": BreakpointMap.XXXL,
  xxxl: BreakpointMap.XXXL,
});

/**
 * Composable for determining if the current viewport meets or exceeds a specified breakpoint. This function uses the useBreakpoints composable from VueUse to define custom breakpoints and provides a reactive reference that indicates whether the current viewport is greater than or equal to the specified breakpoint. The breakpointName parameter accepts predefined breakpoint names such as "sm", "md", "lg", "xl", "2xl", "xxl", "3xl", and "xxxl". By calling this composable with a specific breakpoint name, you can easily determine if the current viewport size meets the criteria for that breakpoint, allowing you to implement responsive design features in your Vue components.
 * @param breakpointName A reactive reference or getter that specifies the name of the breakpoint to compare against. The accepted breakpoint names include "sm", "md", "lg", "xl", "2xl", "xxl", "3xl", and "xxxl". This parameter allows you to dynamically determine if the current viewport meets or exceeds the specified breakpoint, enabling responsive design features in your Vue components.
 * @returns A reactive reference that evaluates to true if the current viewport is greater than or equal to the specified breakpoint, and false otherwise. This allows you to conditionally render or style components based on the viewport size, facilitating responsive design in your application.
 */
export default function useBreakpoint(
  breakpointName: MaybeRefOrGetter<
    "sm" | "md" | "lg" | "xl" | "2xl" | "xxl" | "3xl" | "xxxl"
  >
): Ref<boolean> {
  return breakpoints.greaterOrEqual(breakpointName);
}
