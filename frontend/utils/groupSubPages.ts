// SPDX-License-Identifier: AGPL-3.0-or-later
import type { TabPage } from "~/types/tab";

import { IconMap } from "~/types/icon-map";

export function getGroupTabs(): TabPage[] {
  const i18n = useI18n();
  const route = useRoute();

  const { orgId, groupId } = route.params;

  const groupAboutPageSelector: TabPage = {
    id: 0,
    label: i18n.t("i18n._global.about"),
    iconName: `${IconMap.ABOUT}`,
    routeUrl: `/organizations/${orgId}/groups/${groupId}/about`,
    selected: false,
  };

  const groupEventPageSelector: TabPage = {
    id: 1,
    label: i18n.t("i18n._global.events"),
    iconName: `${IconMap.EVENT}`,
    routeUrl: `/organizations/${orgId}/groups/${groupId}/events`,
    selected: false,
  };

  const groupEventResourcesSelector: TabPage = {
    id: 2,
    label: i18n.t("i18n._global.resources"),
    iconName: "IconResource",
    routeUrl: `/organizations/${orgId}/groups/${groupId}/resources`,
    selected: false,
  };

  const groupEventFaqSelector: TabPage = {
    id: 3,
    label: i18n.t("i18n._global.faq"),
    iconName: "IconFAQ",
    routeUrl: `/organizations/${orgId}/groups/${groupId}/faq`,
    selected: false,
  };

  return [
    groupAboutPageSelector,
    groupEventPageSelector,
    groupEventResourcesSelector,
    groupEventFaqSelector,
  ];
}
