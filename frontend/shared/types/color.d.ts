// SPDX-License-Identifier: AGPL-3.0-or-later
export type ColorByEventTypeAndThemeType =
  (typeof ColorByEventTypeAndTheme)[keyof typeof ColorByEventTypeAndTheme];
