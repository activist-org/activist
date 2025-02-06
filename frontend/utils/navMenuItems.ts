// SPDX-License-Identifier: AGPL-3.0-or-later
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

export const menuItems = [
  {
    label: i18nMap._global.home,
    routeUrl: "/home",
    iconUrl: `${IconMap.HOME}`,
  },
  {
    label: i18nMap._global.events,
    routeUrl: "/events",
    iconUrl: `${IconMap.EVENT}`,
  },
  {
    label: i18nMap._global.organizations,
    routeUrl: "/organizations",
    iconUrl: "IconOrganization",
  },
];
