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
