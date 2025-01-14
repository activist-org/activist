// SPDX-License-Identifier: AGPL-3.0-or-later
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
  // TODO: Convert to an array.
  orgs: Organization;
  eventTextId: string;
  discussion?: DiscussionEntry[];
  resources?: Resource[];
  // task?: Task[];
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

export interface EventText {
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
