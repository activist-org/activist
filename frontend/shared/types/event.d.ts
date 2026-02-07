// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Main Table

interface EventBase extends Entity {
  tagline?: string;
  iconUrl?: ContentImage;
  type: EventType;
  onlineLocationLink?: string;
  physicalLocation?: PhysicalLocation;
  socialLinks: EventSocialLink[];
  faqEntries?: FaqEntry[];
  times: EventTime[];
  // TODO: Convert to an array.
  orgs: Organization;
  discussion?: DiscussionEntry[];
  resources?: Resource[];
  // task?: Task[];
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}

export type EventType = "action" | "learn";
// Note: CommunityEvent is used in the frontend to refer to events since "event" is a reserved word in JS.
export interface CommunityEvent extends EventBase {
  texts: EventText[];
}

export type EventsPaginatedResponse = PaginatedResponse<CommunityEvent>;

export interface EventTime {
  startTime: string;
  endTime: string;
  allDay: boolean;
}

// MARK: Bridge Tables

export interface EventAttendee {
  eventId: string;
  userId: string;
  roleId: string;
  attendeeStatus: number;
}

// MARK: Event filters.

export interface EventFilters {
  setting?: EventType;
  locationType?: "online" | "physical";
  topics?: TopicEnum[]; // array of topic IDs
  name?: string; // search term for event name
  days_ahead?: number; // number of days in the future
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
  getInvolvedUrl?: string;
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
  getInvolvedUrl?: string;
}

export interface EventTimeInput {
  date: string;
  all_day: boolean;
  start_time?: string;
  end_time?: string;
}

export interface CreateEventInput {
  name: string;
  tagline?: string;
  description: string;
  organizations: string[];
  groups?: string[];
  location_type: "offline" | "online";
  event_type: EventType;
  topics: TopicEnum[];
  online_location_link?: string;
  location?: {
    address_or_name: string;
    city: string;
    country_code: string;
    lat: string;
    lon: string;
    bbox: string[];
  };
  times: EventTimeInput[];
}
