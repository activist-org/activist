// SPDX-License-Identifier: AGPL-3.0-or-later
import { useBreakpoints } from "@vueuse/core";

// Define your map outside, as it's just a constant
const BREAKPOINTS_MAP = {
  sm: BreakpointMap.SMALL,
  md: BreakpointMap.MEDIUM,
  lg: BreakpointMap.LARGE,
  xl: BreakpointMap.XL,
  "2xl": BreakpointMap.XXL,
  xxl: BreakpointMap.XXL,
  "3xl": BreakpointMap.XXXL,
  xxxl: BreakpointMap.XXXL,
};

export default function useBreakpoint(
  breakpointName: MaybeRefOrGetter<
    "sm" | "md" | "lg" | "xl" | "2xl" | "xxl" | "3xl" | "xxxl"
  >
): Ref<boolean> {
  // Call useBreakpoints INSIDE the composable so it runs within the Vue setup context
  const breakpoints = useBreakpoints(BREAKPOINTS_MAP);

  return breakpoints.greaterOrEqual(breakpointName);
}
