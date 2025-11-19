// SPDX-License-Identifier: AGPL-3.0-or-later
export interface TabPage {
  id: number;
  label: string;
  iconName?: string;
  routeUrl: string;
  selected: boolean;
}
