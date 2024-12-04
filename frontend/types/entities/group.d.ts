import type { Location } from "~/types/content/location";

// MARK: Main Table

export interface Group {
  id: string;
  groupName: string;
  name: string;
  tagline: string;
  organization: Organization;
  createdBy: User;
  // category?: string;

  location: Location;

  getInvolvedUrl: string;
  socialLinks: string[];
  creationDate: string;
  // deletionDate: string;

  // group_event
  // events: Event[];

  // faq
  faqEntries?: FaqEntry[];

  // group_resource
  resources?: Resource[];

  // group_text
  groupTextId: string;
  texts: GroupText;

  // group_topic
  // topics?: Topic[];

  // support
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
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

export interface PiniaResGroup {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: Group;
  _value: Group;
}

export interface PiniaResGroupText {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: {
    count: integer;
    next: null;
    previous: null;
    results: GroupText[];
  };
  _value: {
    count: integer;
    next: null;
    previous: null;
    results: GroupText[];
  };
}
