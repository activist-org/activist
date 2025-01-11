import type { Location } from "~/types/content/location";

// MARK: Main Table

interface EventBase {
  id: string;
  name: string;
  tagline?: string;
  createdBy: User;
  iconUrl?: string;
  type: "action" | "learn";
  onlineLocationLink?: string;

  offlineLocation?: Location;

  getInvolvedUrl?: string;
  socialLinks: string[];
  startTime: string;
  endTime?: string;
  creationDate?: string;
  // deletionDate?: string;

  // discussion
  discussion?: DiscussionEntry[];

  // event_organization
  organizations: Organization[];

  // event_resource
  resources?: Resource[];

  // event_task
  // task?: Task[];

  // event_text
  eventTextId: string;

  // support
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}

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

export interface EventFormat {
  eventId: string;
  formatId: int;
}

export interface EventResource {
  eventId: string;
  resourceId: string;
}

export interface EventRole {
  eventId: string;
  roleId: string;
}

export interface EventSeries {
  eventId: string;
  seriesId: string;
}

export interface EventTag {
  eventId: string;
  tagId: string;
}

export interface EventTask {
  eventId: string;
  taskId: string;
}

export interface EventText {
  eventId: string;
  iso: string;
  primary: boolean;
  description: string;
  getInvolved: string;
}

export interface EventTopic {
  eventId: string;
  topicId: string;
}

// MARK: Pinia Responses

export interface EventResponse extends EventBase {
  texts: EventText[];
}

export interface PiniaResEvent {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: EventResponse;
  _value: EventResponse;
}

export interface PiniaResEvents {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: EventResponse[];
  _value: EventResponse[];
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
  getInvolvedUrl: string;
}
