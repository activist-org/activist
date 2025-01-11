import type { Location } from "~/types/content/location";

// MARK: Main Table

interface GroupBase {
  id: string;
  groupName: string;
  name: string;
  tagline: string;
  organization: Organization;
  createdBy: User;
  iconUrl?: string;
  orgId?: string;
  location: Location;

  getInvolvedUrl: string;
  socialLinks: string[];
  creationDate: string;

  // group_event
  events?: Event[];

  // group_faq
  faqEntries?: FaqEntry[];

  // group_resource
  resources?: Resource[];

  // group_text
  groupTextId: string;

  // group_topic
  // topics?: Topic[];

  // support
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}

export interface Group extends GroupBase {
  texts: GroupText;
}

// MARK: Bridge Tables

export interface GroupEvent {
  groupId: string;
  eventId: string;
}

export interface GroupImage {
  groupId: string;
  imageId: string;
  sequenceIndex: number;
}

export interface GroupMember {
  groupId: string;
  userId: string;
  isOwner: boolean;
  isAdmin: boolean;
  isComms: boolean;
}

export interface GroupResource {
  groupId: string;
  resourceId: string;
}

export interface GroupText {
  groupId: string;
  iso: string;
  primary: boolean;
  description: string;
  getInvolved: string;
  donationPrompt: string;
}

export interface GroupTopic {
  groupId: string;
  topicId: string;
}

// MARK: Pinia Responses

export interface GroupResponse extends GroupBase {
  texts: GroupText[];
}

export interface PiniaResGroup {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: GroupResponse;
  _value: GroupResponse;
}

export interface PiniaResGroups {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: GroupResponse[];
  _value: GroupResponse[];
}

// MARK: Form Data

export interface GroupCreateFormData {
  name: string;
  tagline: string;
  location: string;
  description: string;
  social_accounts: string[];
  topics: Topic[];
}

export interface GroupUpdateTextFormData {
  description: string;
  getInvolved: string;
  getInvolvedUrl: string;
}
