// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Factory functions for creating mock store data.
 * These ensure consistent test data structure across all store tests.
 */
import type {
  CommunityEvent,
  EventFilters,
  EventText,
} from "../../shared/types/event";
import type { ContentImage } from "../../shared/types/file-type";
import type { Group, GroupFilters, GroupText } from "../../shared/types/group";
import type { PhysicalLocation } from "../../shared/types/location-type";
import type {
  Organization,
  OrganizationFilters,
  OrganizationText,
} from "../../shared/types/organization";
import type { SocialLink } from "../../shared/types/social-link";
import type { Topic } from "../../shared/types/topics-type";
import type { User } from "../../shared/types/user";

import {
  defaultContentImageData,
  defaultEventData,
  defaultEventFiltersData,
  defaultEventTextData,
  defaultGroupData,
  defaultGroupFiltersData,
  defaultGroupTextData,
  defaultOrganizationData,
  defaultOrganizationFiltersData,
  defaultOrganizationTextData,
  defaultPhysicalLocationData,
  defaultSocialLinkData,
  defaultTopicData,
  defaultUserData,
  defaultResourceData,
} from "./data";

// Type helper to include inherited Entity properties (workaround for .d.ts inheritance).
type WithEntityProps<T> = Partial<T> & {
  id?: string;
  name?: string;
  createdBy?: unknown;
  creationDate?: string;
};

// MARK: Resource

export const createResource = (
  overrides: Partial<Resource> = {}
): Resource => ({
  ...defaultResourceData,
  ...overrides,
});

// MARK: ContentImage

export function createMockContentImage(
  overrides?: Partial<ContentImage>
): ContentImage {
  return {
    ...defaultContentImageData,
    ...overrides,
  };
}

// MARK: User

export function createMockUser(overrides?: Partial<User>): User {
  return {
    ...defaultUserData,
    ...overrides,
  };
}

// MARK: PhysicalLocation

export function createMockPhysicalLocation(
  overrides?: Partial<PhysicalLocation>
): PhysicalLocation {
  return {
    ...defaultPhysicalLocationData,
    ...overrides,
  };
}

// MARK: SocialLink

export function createMockSocialLink(
  overrides?: Partial<SocialLink>
): SocialLink {
  return {
    ...defaultSocialLinkData,
    ...overrides,
  };
}

// MARK: Event

export function createMockEventText(overrides?: Partial<EventText>): EventText {
  return {
    ...defaultEventTextData,
    ...overrides,
  };
}

export function createMockEvent(
  overrides?: WithEntityProps<CommunityEvent>
): CommunityEvent {
  return {
    ...defaultEventData,
    createdBy: createMockUser(),
    orgs: createMockOrganization(),
    ...overrides,
  } as CommunityEvent;
}

export function createMockEventFilters(
  overrides?: Partial<EventFilters>
): EventFilters {
  return {
    ...defaultEventFiltersData,
    ...overrides,
  };
}

// MARK: Organization

export function createMockOrganizationText(
  overrides?: Partial<OrganizationText>
): OrganizationText {
  return {
    ...defaultOrganizationTextData,
    ...overrides,
  };
}

export function createMockOrganization(
  overrides?: WithEntityProps<Organization>
): Organization {
  return {
    ...defaultOrganizationData,
    createdBy: createMockUser(),
    location: createMockPhysicalLocation(),
    ...overrides,
  } as Organization;
}

export function createMockOrganizationFilters(
  overrides?: Partial<OrganizationFilters>
): OrganizationFilters {
  return {
    ...defaultOrganizationFiltersData,
    ...overrides,
  };
}

// MARK: Group

export function createMockGroupText(overrides?: Partial<GroupText>): GroupText {
  return {
    ...defaultGroupTextData,
    ...overrides,
  };
}

export function createMockGroup(overrides?: WithEntityProps<Group>): Group {
  return {
    ...defaultGroupData,
    createdBy: createMockUser(),
    location: createMockPhysicalLocation(),
    org: createMockOrganization(),
    ...overrides,
  } as Group;
}

export function createMockGroupFilters(
  overrides?: Partial<GroupFilters>
): GroupFilters {
  return {
    ...defaultGroupFiltersData,
    ...overrides,
  };
}

// MARK: Topic

export function createMockTopic(overrides?: Partial<Topic>): Topic {
  return {
    ...defaultTopicData,
    creation_date: new Date(defaultTopicData.creation_date),
    last_updated: new Date(defaultTopicData.last_updated),
    ...overrides,
  };
}
