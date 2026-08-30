// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Computes the navigation target URL for various entity types (Organization, Group, Event, Resource, User),
 * automatically appending `/about` for internal entity detail pages.
 *
 * @param props - Entity payload containing optional organization, group, event, resource, or user.
 * @returns An object containing the reactive `linkUrl` computed property.
 */
export function useLinkURL(props: {
  organization?: Organization | null;
  group?: Group | null;
  event?: CommunityEvent | null;
  resource?: Resource | null;
  user?: UserActivist | null;
}) {
  const linkUrl = computed<string>(() => {
    let url = "";
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
    }

    if (url && !props.resource) {
      return `${url}/about`;
    }
    return url;
  });

  return {
    linkUrl,
  };
}
