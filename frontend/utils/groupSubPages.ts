// SPDX-License-Identifier: AGPL-3.0-or-later
import type { SubPageSelector } from "~/types/sub-page-selector";

import { IconMap } from "~/types/icon-map";

export function getGroupSubPages(): SubPageSelector[] {
  const i18n = useI18n();
  const route = useRoute();

  const routeParts = route.path.split("/");
  const organizationId = routeParts[3];
  const groupId = routeParts[5];

  const groupAboutPageSelector: SubPageSelector = {
    id: 0,
    label: i18n.t("i18n._global.about"),
    iconName: `${IconMap.ABOUT}`,
    routeUrl: `/organizations/${organizationId}/groups/${groupId}/about`,
    selected: false,
  };

  const groupEventPageSelector: SubPageSelector = {
    id: 1,
    label: i18n.t("i18n._global.events"),
    iconName: `${IconMap.EVENT}`,
    routeUrl: `/organizations/${organizationId}/groups/${groupId}/events`,
    selected: false,
  };

  const groupEventResourcesSelector: SubPageSelector = {
    id: 2,
    label: i18n.t("i18n._global.resources"),
    iconName: "IconResource",
    routeUrl: `/organizations/${organizationId}/groups/${groupId}/resources`,
    selected: false,
  };

  const groupEventFAQSelector: SubPageSelector = {
    id: 3,
    label: i18n.t("i18n._global.faq"),
    iconName: "IconFAQ",
    routeUrl: `/organizations/${organizationId}/groups/${groupId}/faq`,
    selected: false,
  };

  return [
    groupAboutPageSelector,
    groupEventPageSelector,
    groupEventResourcesSelector,
    groupEventFAQSelector,
  ];
}
