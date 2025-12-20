// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Default mock data constants for test factories.
 * These values are used as defaults when creating mock entities in tests.
 */
import { TopicEnum } from "../../shared/types/topics";

// MARK: ContentImage

export const defaultContentImageData = {
  id: "img-1",
  fileObject: "/test/image.png",
  creation_date: "2024-01-01T00:00:00Z",
  sequence_index: 0,
} as const;

// MARK: User

export const defaultUserData = {
  id: "user-1",
  userName: "testuser",
  name: "Test User",
  socialLinks: [] as string[],
} as const;

// MARK: PhysicalLocation

export const defaultPhysicalLocationData = {
  id: "loc-1",
  lat: "0.0",
  lon: "0.0",
  bbox: [] as string[],
  displayName: "Test Location",
} as const;

// MARK: SocialLink

export const defaultSocialLinkData = {
  id: "social-1",
  link: "https://example.com",
  label: "Website",
  order: 0,
  creationDate: "2024-01-01T00:00:00Z",
  lastUpdated: "2024-01-01T00:00:00Z",
} as const;

// MARK: Event

export const defaultEventTextData = {
  id: 1,
  eventId: "event-1",
  iso: "en",
  primary: true,
  description: "Test event description",
  getInvolved: "Get involved text",
} as const;

export const defaultEventData = {
  id: "event-1",
  name: "Test Event",
  type: "action",
  startTime: "2024-01-01T10:00:00Z",
  socialLinks: [],
  texts: [],
} as const;

export const defaultEventFiltersData = {
  setting: "action",
  locationType: "online",
} as const;

// MARK: Organization

export const defaultOrganizationTextData = {
  id: 1,
  orgId: "org-1",
  iso: "en",
  primary: true,
  description: "Test organization description",
  getInvolved: "Get involved text",
  donationPrompt: "Donate now",
} as const;

export const defaultOrganizationData = {
  id: "org-1",
  name: "Test Organization",
  orgName: "Test Organization",
  tagline: "Test tagline",
  socialLinks: [],
  status: 1,
  texts: [],
} as const;

export const defaultOrganizationFiltersData = {
  name: "Test",
} as const;

// MARK: Group

export const defaultGroupTextData = {
  id: 1,
  groupId: "group-1",
  iso: "en",
  primary: true,
  description: "Test group description",
  getInvolved: "Get involved text",
  donationPrompt: "Donate now",
} as const;

export const defaultGroupData = {
  id: "group-1",
  name: "Test Group",
  groupName: "Test Group",
  tagline: "Test tagline",
  socialLinks: [],
  texts: [],
} as const;

// MARK: Topic

export const defaultTopicData = {
  id: "topic-1",
  type: TopicEnum.ENVIRONMENT,
  active: true,
  // Dates stored as strings to avoid sharing Date instances.
  creation_date: "2024-01-01",
  last_updated: "2024-01-01",
} as const;
