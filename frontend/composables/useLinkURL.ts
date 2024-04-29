import type { Event } from "~/types/event";
import type { Group } from "~/types/group";
import type { Organization } from "~/types/organization";
import type { Resource } from "~/types/resource";
import type { User } from "~/types/user";

export function useLinkURL(props: {
  organization?: Organization;
  group?: Group;
  event?: Event;
  resource?: Resource;
  user?: User;
}) {
  const linkURL = computed<string>(() => {
    if (props.organization) {
      return `${BASE_FRONTEND_URL}/organizations/${props.organization.id}`;
    } else if (props.group) {
      return `${BASE_FRONTEND_URL}/organizations/${props.group.organization.id}/groups/${props.group.id}`;
    } else if (props.event) {
      return `${BASE_FRONTEND_URL}/events/${props.event.id}`;
    } else if (props.resource) {
      return props.resource.resourceURL;
    } else if (props.user) {
      return `${BASE_FRONTEND_URL}/users/${props.user.id}`;
    } else {
      return "";
    }
  });

  return {
    linkURL,
  };
}
