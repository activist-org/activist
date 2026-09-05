// SPDX-License-Identifier: AGPL-3.0-or-later
export {};

type IconMapType = typeof IconMap;
type BreakpointMapType = typeof BreakpointMap;
type Entity = typeof EntityType;
type ColorByEventTypeAndThemeType = typeof ColorByEventTypeAndTheme;
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    IconMap: IconMapType;
    BreakpointMap: BreakpointMapType;
    EntityMap: Entity;
    ColorByEventTypeAndTheme: ColorByEventTypeAndThemeType;
  }
}
