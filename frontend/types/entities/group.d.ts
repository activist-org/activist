// MARK: Main Table

export interface Group {
  id: string;
  group_name: string;
  name: string;
  tagline: string;
  organization: Organization;
  createdBy: User;
  // category?: string;
  location: string;
  getInvolvedURL: string;
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
  description: string;
  getInvolved: string;
  donationPrompt: string;

  // group_topic
  // topics?: Topic[];

  // support
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}

// MARK: Bridge Tables

export interface GroupEvent {
  groupID: string;
  eventID: string;
}

export interface GroupImage {
  groupID: string;
  imageID: string;
  sequenceIndex: number;
}

export interface GroupMember {
  groupID: string;
  userID: string;
  isOwner: boolean;
  isAdmin: boolean;
  isComms: boolean;
}

export interface GroupResource {
  groupID: string;
  resourceID: string;
}

export interface GroupText {
  groupID: string;
  iso: string;
  primary: boolean;
  description: string;
  getInvolved: string;
  donationPrompt: string;
}

export interface GroupTopic {
  groupID: string;
  topicID: string;
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
