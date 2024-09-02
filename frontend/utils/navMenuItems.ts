import { IconMap } from "~/types/icon-map";

export const menuItems = [
  {
    label: "_global.home",
    routeURL: "/home",
    iconURL: `${IconMap.HOME}`,
  },
  {
    label: "_global.events",
    routeURL: "/events",
    iconURL: `${IconMap.EVENT}`,
  },
  {
    label: "utils.nav_menu_items.organizations",
    routeURL: "/organizations",
    iconURL: "IconOrganization",
  },
];
