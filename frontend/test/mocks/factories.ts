// SPDX-License-Identifier: AGPL-3.0-or-later
import type {
  CommunityEvent,
  EventFilters,
  EventText,
} from "../../shared/types/event";
import type { ContentImage } from "../../shared/types/file-type";
import type { Group, GroupText } from "../../shared/types/group";
import type {
  Organization,
  OrganizationFilters,
  OrganizationText,
} from "../../shared/types/organization";
import type { SocialLink } from "../../shared/types/social-link";
import type { Topic } from "../../shared/types/topics-type";
import type { User } from "../../shared/types/user";

import { TopicEnum } from "../../shared/types/topics";

// PhysicalLocation is exported from location.d.ts, but location.ts exists and takes precedence
// in module resolution. We define it inline to avoid the conflict.
interface PhysicalLocation {
  id: string;
  lat: string;
  lon: string;
  bbox: string[];
  displayName: string;
}

/**
 * Factory functions for creating mock store data.
 * These ensure consistent test data structure across all store tests.
 */

// MARK: ContentImage

export function createMockContentImage(
  overrides?: Partial<ContentImage>
): ContentImage {
  return {
    id: "img-1",
    fileObject: "/test/image.png",
    creation_date: "2024-01-01T00:00:00Z",
    sequence_index: 0,
    ...overrides,
  };
}

// MARK: User

export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "user-1",
    userName: "testuser",
    name: "Test User",
    socialLinks: [],
    ...overrides,
  };
}

// MARK: PhysicalLocation

export function createMockPhysicalLocation(
  overrides?: Partial<PhysicalLocation>
): PhysicalLocation {
  return {
    id: "loc-1",
    lat: "0.0",
    lon: "0.0",
    bbox: [],
    displayName: "Test Location",
    ...overrides,
  };
}

// MARK: SocialLink

export function createMockSocialLink(
  overrides?: Partial<SocialLink>
): SocialLink {
  return {
    id: "social-1",
    link: "https://example.com",
    label: "Website",
    order: 0,
    creationDate: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

// MARK: Event

export function createMockEventText(overrides?: Partial<EventText>): EventText {
  return {
    id: 1,
    eventId: "event-1",
    iso: "en",
    primary: true,
    description: "Test event description",
    getInvolved: "Get involved text",
    ...overrides,
  };
}

export function createMockEvent(
  overrides?: Partial<CommunityEvent>
): CommunityEvent {
  return {
    id: "event-1",
    name: "Test Event",
    createdBy: createMockUser(),
    type: "action",
    startTime: "2024-01-01T10:00:00Z",
    orgs: createMockOrganization(),
    socialLinks: [],
    texts: [],
    ...overrides,
  } as CommunityEvent;
}

export function createMockEventFilters(
  overrides?: Partial<EventFilters>
): EventFilters {
  return {
    setting: "action",
    locationType: "online",
    ...overrides,
  };
}

// MARK: Organization

export function createMockOrganizationText(
  overrides?: Partial<OrganizationText>
): OrganizationText {
  return {
    id: 1,
    orgId: "org-1",
    iso: "en",
    primary: true,
    description: "Test organization description",
    getInvolved: "Get involved text",
    donationPrompt: "Donate now",
    ...overrides,
  };
}

export function createMockOrganization(
  overrides?: Partial<Organization>
): Organization {
  return {
    id: "org-1",
    name: "Test Organization",
    createdBy: createMockUser(),
    orgName: "Test Organization",
    tagline: "Test tagline",
    location: createMockPhysicalLocation(),
    socialLinks: [],
    status: 1,
    texts: [],
    ...overrides,
  } as Organization;
}

export function createMockOrganizationFilters(
  overrides?: Partial<OrganizationFilters>
): OrganizationFilters {
  return {
    name: "Test",
    ...overrides,
  };
}

// MARK: Group

export function createMockGroupText(overrides?: Partial<GroupText>): GroupText {
  return {
    id: 1,
    groupId: "group-1",
    iso: "en",
    primary: true,
    description: "Test group description",
    getInvolved: "Get involved text",
    donationPrompt: "Donate now",
    ...overrides,
  };
}
export function createMockGroup(overrides?: Partial<Group>): Group {
  return {
    id: "group-1",
    name: "Test Group",
    createdBy: createMockUser(),
    groupName: "Test Group",
    tagline: "Test tagline",
    location: createMockPhysicalLocation(),
    org: createMockOrganization(),
    socialLinks: [],
    texts: [],
    ...overrides,
  } as Group;
}

// MARK: Topic

export function createMockTopic(overrides?: Partial<Topic>): Topic {
  return {
    id: "topic-1",
    type: TopicEnum.ENVIRONMENT,
    active: true,
    creation_date: new Date("2024-01-01"),
    last_updated: new Date("2024-01-01"),
    ...overrides,
  };
}
