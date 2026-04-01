// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Composable for generating a link URL based on the provided props, which can include an organization, group, event, resource, or user. The composable computes the appropriate URL for the given entity type and returns it as a computed property. If the entity is an organization, the URL will point to the organization's page; if it's a group, the URL will point to the group's page within its organization; if it's an event, the URL will point to the event's page; if it's a resource, the URL will be the resource's external URL; and if it's a user, the URL will point to the user's profile page. Additionally, if the screen size is above the medium breakpoint and the entity is not a resource, "/about" will be appended to the URL for organizations and groups to direct users to their about pages.
 * @param props An object containing optional properties for organization, group, event, resource, and user, which will be used to determine the appropriate URL to generate based on the type of entity provided.
 * @param props.organization An optional Organization object that, if provided, will be used to generate a URL pointing to the organization's page.
 * @param props.group An optional Group object that, if provided, will be used to generate a URL pointing to the group's page within its organization.
 * @param props.event An optional CommunityEvent object that, if provided, will be used to generate a URL pointing to the event's page.
 * @param props.resource An optional Resource object that, if provided, will be used to generate a URL pointing to the resource's external URL.
 * @param props.user An optional UserActivist object that, if provided, will be used to generate a URL pointing to the user's profile page.
 * @returns linkUrl A computed property that contains the generated URL based on the provided props, which can be used in components to create links to the appropriate pages for organizations, groups, events, resources, or users.
 */
export function useLinkURL(props: {
  organization?: Organization | null;
  group?: Group | null;
  event?: CommunityEvent | null;
  resource?: Resource | null;
  user?: UserActivist | null;
}) {
  const aboveMediumBP = useBreakpoint("md");
  const linkUrl = computed<string>(() => {
    let url: string = "";
    if (props.organization) {
      url = `/organizations/${props.organization.id}`;
    } else if (props.group) {
      url = `/organizations/${props.group.org.id}/groups/${props.group.id}`;
    } else if (props.event) {
      url = `/events/${props.event.id}`;
    } else if (props.resource) {
      url = props.resource.url;
    } else if (props.user) {
      url = `/users/${props.user.id}`;
    } else {
      url = "";
    }

    if (aboveMediumBP && !props.resource) {
      return `${url}/about`;
    } else {
      return url;
    }
  });

  return {
    linkUrl,
  };
}
