// SPDX-License-Identifier: AGPL-3.0-or-later
import { useBreakpoints } from "@vueuse/core";
import { BreakpointMap } from "~/types/breakpoint-map";

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

export default function useBreakpoint(
  breakpointName: MaybeRefOrGetter<
    "sm" | "md" | "lg" | "xl" | "2xl" | "xxl" | "3xl" | "xxxl"
  >
): Ref<boolean> {
  return breakpoints.greaterOrEqual(breakpointName);
}
