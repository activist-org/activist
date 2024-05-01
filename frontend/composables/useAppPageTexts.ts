import type { Event } from "~/types/event";
import type { Group } from "~/types/group";
import type { Organization } from "~/types/organization";
import type { User } from "~/types/user";

export function useDescriptionText(props: {
  organization?: Organization;
  group?: Group;
  event?: Event;
  user?: User;
}) {
  const descriptionText = computed<string>(() => {
    if (props.organization && props.organization.description) {
      return props.organization.description;
    } else if (props.group && props.group.description) {
      return props.group.description;
    } else if (props.event && props.event.description) {
      return props.event.description;
    } else {
      return "";
    }
  });

  return {
    descriptionText,
  };
}

export function useGetInvolvedText(props: {
  organization?: Organization;
  group?: Group;
  event?: Event;
  user?: User;
}) {
  const getInvolvedText = computed<string>(() => {
    if (props.organization) {
      if (props.organization.getInvolved) {
        return props.organization.getInvolved;
      } else if (props.organization.groups) {
        return "components.card-get-involved.working-groups-subtext";
      } else {
        return "components.card-get-involved.join-organization-subtext";
      }
    } else if (props.group) {
      if (props.group.getInvolved) {
        return props.group.getInvolved;
      } else {
        return "components.card-get-involved.join-group-subtext";
      }
    } else if (props.event) {
      if (props.event.getInvolved) {
        return props.event.getInvolved;
      } else {
        return "components.card-get-involved.participate-subtext";
      }
    } else {
      return "";
    }
  });

  return {
    getInvolvedText,
  };
}

export function useGetInvolvedURL(props: {
  organization?: Organization;
  group?: Group;
  event?: Event;
  user?: User;
}) {
  const getInvolvedURL = computed<string>(() => {
    if (props.organization && props.organization.getInvolvedURL) {
      return props.organization.getInvolvedURL;
    } else if (props.group && props.group.getInvolvedURL) {
      return props.group.getInvolvedURL;
    } else if (props.event && props.event.getInvolvedURL) {
      return props.event.getInvolvedURL;
    } else {
      return "";
    }
  });

  return {
    getInvolvedURL,
  };
}
