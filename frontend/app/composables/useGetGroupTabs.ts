// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Composable for generating an array of tab page objects for a group page in the frontend application. This composable uses the Vue I18n library to provide localized labels for the tabs and the Vue Router to access route parameters for constructing the URLs for each tab. The generated tabs include an "About" tab, an "Events" tab, a "Resources" tab, and an "FAQ" tab, each with its own icon and route URL based on the organization and group IDs from the route parameters. The composable returns an array of TabPage objects that can be used to render the appropriate tabs in the group page component.
 * @returns An array of TabPage objects representing the tabs for the group page, including their labels, icons, route URLs, and selection state.
 */
export function useGetGroupTabs(): TabPage[] {
  const { t } = useI18n();
  const route = useRoute();

  const { orgId, groupId } = route.params;

  const groupAboutPageSelector: TabPage = {
    id: 0,
    label: t("i18n._global.about"),
    iconName: `${IconMap.ABOUT}`,
    routeUrl: `/organizations/${orgId}/groups/${groupId}/about`,
    selected: false,
  };

  const groupEventPageSelector: TabPage = {
    id: 1,
    label: t("i18n._global.events"),
    iconName: `${IconMap.EVENT}`,
    routeUrl: `/organizations/${orgId}/groups/${groupId}/events`,
    selected: false,
  };

  const groupEventResourcesSelector: TabPage = {
    id: 2,
    label: t("i18n._global.resources"),
    iconName: "IconResource",
    routeUrl: `/organizations/${orgId}/groups/${groupId}/resources`,
    selected: false,
  };

  const groupEventFaqSelector: TabPage = {
    id: 3,
    label: t("i18n._global.faq"),
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
