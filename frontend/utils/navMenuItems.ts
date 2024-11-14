import { IconMap } from "~/types/icon-map";

export const menuItems = [
  {
    label: "_global.home",
    routeUrl: "/home",
    iconUrl: `${IconMap.HOME}`,
  },
  {
    label: "_global.events",
    routeUrl: "/events",
    iconUrl: `${IconMap.EVENT}`,
  },
  {
    label: "utils.nav_menu_items.organizations",
    routeUrl: "/organizations",
    iconUrl: "IconOrganization",
  },
];
