// SPDX-License-Identifier: AGPL-3.0-or-later
export interface MenuSelector {
  id: number | string;
  label: string;
  routeUrl: string;
  iconUrl: string;
  selected: boolean;
}

export interface BarMenu {
  id: string;
  ariaLabel: string;
  label: string;
  icon: string;
  isFontBold: boolean;
  panelButtons: MenuSelector[];
}
