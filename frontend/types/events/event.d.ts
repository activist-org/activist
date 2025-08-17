// SPDX-License-Identifier: AGPL-3.0-or-later
import type { ContentImage } from "~/types/content/file";
import type { Location } from "~/types/content/location";
import type { SocialLink } from "~/types/content/social-link";
// MARK: Main Table

interface EventBase {
  id: string;
  name: string;
  tagline?: string;
  createdBy: User;
  iconUrl?: ContentImage;
  type: EventType;
  onlineLocationLink?: string;
  offlineLocation?: Location;
  getInvolvedUrl?: string;
  socialLinks: EventSocialLink[];
  faqEntries?: FaqEntry[];
  startTime: string;
  endTime?: string;
  creationDate?: string;
  // TODO: Convert to an array.
  orgs: Organization;
  discussion?: DiscussionEntry[];
  resources?: Resource[];
  // task?: Task[];
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}

export type EventType = "action" | "learn";

export interface Event extends EventBase {
  texts: EventText;
}

// MARK: Bridge Tables

export interface EventAttendee {
  eventId: string;
  userId: string;
  roleId: string;
  attendeeStatus: int;
}

export interface EventSocialLink extends SocialLink {
  eventId: string;
}

export interface EventText {
  id: number;
  eventId: string;
  iso: string;
  primary: boolean;
  description: string;
  getInvolved: string;
}

// MARK: Pinia Responses

export interface EventResponse extends EventBase {
  texts: EventText[];
}

export interface EventsResponseBody {
  count: number;
  next: number | null;
  previous: number | null;
  results: EventResponse[];
}

export interface PiniaResEvent {
  __v_isRef: boolean;
  __v_isShallow: boolean;
  _rawValue: EventResponse;
  _value: EventResponse;
}

export interface PiniaResEvents {
  __v_isRef: boolean;
  __v_isShallow: boolean;
  _rawValue: EventsResponseBody;
  _value: EventsResponseBody;
}

// MARK: Form Data

export interface EventCreateFormData {
  name: string;
  tagline: string;
  location: string;
  description: string;
  social_accounts: string[];
  topics: Topic[];
}

export interface EventUpdateTextFormData {
  description: string;
  getInvolved: string;
  getInvolvedUrl: string | undefined;
}
