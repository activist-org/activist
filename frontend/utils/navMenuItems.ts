// SPDX-License-Identifier: AGPL-3.0-or-later

import { IconMap } from "~/types/icon-map";

export const menuItems = [
  {
    label: "i18n._global.home",
    routeUrl: "/home",
    iconUrl: `${IconMap.HOME}`,
  },
  {
    label: "i18n._global.events",
    routeUrl: "/events",
    iconUrl: `${IconMap.EVENT}`,
  },
  {
    label: "i18n._global.organizations",
    routeUrl: "/organizations",
    iconUrl: "IconOrganization",
  },
];
