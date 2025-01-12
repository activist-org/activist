import type { User } from "~/types/auth/user";
import type { Group } from "~/types/communities/group";
import type { Organization } from "~/types/communities/organization";
import type { Resource } from "~/types/content/resource";
import type { Event } from "~/types/events/event";

const aboveMediumBP = useBreakpoint("md");

export function useLinkURL(props: {
  organization?: Organization;
  group?: Group;
  event?: Event;
  resource?: Resource;
  user?: User;
}) {
  const linkUrl = computed<string>(() => {
    let url: string = "";
    if (props.organization) {
      url = `/organizations/${props.organization.id}`;
    } else if (props.group) {
      url = `/organizations/${props.group.parentOrgId}/groups/${props.group.id}`;
    } else if (props.event) {
      url = `/events/${props.event.id}`;
    } else if (props.resource) {
      url = props.resource.resourceUrl;
    } else if (props.user) {
      url = `/users/${props.user.id}`;
    } else {
      url = "";
    }

    if (aboveMediumBP) {
      return `${url}/about`;
    } else {
      return url;
    }
  });

  return {
    linkUrl,
  };
}
