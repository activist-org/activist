import type { User } from "~/types/auth/user";
import type { Resource } from "~/types/content/resource";
import type { Group } from "~/types/entities/group";
import type { Organization } from "~/types/entities/organization";
import type { Event } from "~/types/events/event";

export function useLinkURL(props: {
  organization?: Organization;
  group?: Group;
  event?: Event;
  resource?: Resource;
  user?: User;
}) {
  const linkURL = computed<string>(() => {
    if (props.organization) {
      return `/organizations/${props.organization.id}`;
    } else if (props.group) {
      return `/organizations/${props.group.organization.id}/groups/${props.group.id}`;
    } else if (props.event) {
      return `/events/${props.event.id}`;
    } else if (props.resource) {
      return props.resource.resourceURL;
    } else if (props.user) {
      return `/users/${props.user.id}`;
    } else {
      return "";
    }
  });

  return {
    linkURL,
  };
}
