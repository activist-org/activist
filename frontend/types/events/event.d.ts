// MARK: Main Table

export interface Event {
  id: string;
  name: string;
  tagline?: string;
  createdBy: User;
  iconURL?: string;
  type: "action" | "learn";
  onlineLocationLink?: string;
  offlineLocation?: string;
  offlineLocationLat?: string;
  offlineLocationLong?: string;
  getInvolvedURL?: string;
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
  description: string;
  getInvolved: string;

  // support
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}

// MARK: Bridge Tables

export interface EventAttendee {
  eventID: string;
  userID: string;
  roleID: string;
  attendeeStatus: int;
}

export interface EventFormat {
  eventID: string;
  formatID: int;
}

export interface EventResource {
  eventID: string;
  resourceID: string;
}

export interface EventRole {
  eventID: string;
  roleID: string;
}

export interface EventSeries {
  eventID: string;
  seriesID: string;
}

export interface EventTag {
  eventID: string;
  tagID: string;
}

export interface EventTask {
  eventID: string;
  taskID: string;
}

export interface EventText {
  eventID: string;
  iso: string;
  primary: boolean;
  description: string;
  getInvolved: string;
}

export interface EventTopic {
  eventID: string;
  topicID: string;
}

// MARK: Pinia Responses

export interface PiniaResEvent {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: Event;
  _value: Event;
}

export interface PiniaResEventText {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: {
    count: integer;
    next: null;
    previous: null;
    results: EventText[];
  };
  _value: {
    count: integer;
    next: null;
    previous: null;
    results: EventText[];
  };
}
