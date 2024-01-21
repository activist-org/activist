export interface MenuSelector {
  id: number;
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
  panelButtons: MenuSelector[];
}
