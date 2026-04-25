// SPDX-License-Identifier: AGPL-3.0-or-later
const aboveMediumBP = useBreakpoint("md");

export function useLinkURL(props: {
  organization?: Organization | null;
  group?: Group | null;
  event?: CommunityEvent | null;
  resource?: Resource | null;
  user?: UserActivist | null;
}) {
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
