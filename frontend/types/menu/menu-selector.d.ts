export interface MenuSelector {
  id: number | string;
  label: string;
  routeURL: string;
  iconURL: string;
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
