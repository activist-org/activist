export interface Event {
  // event
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
  socialLinks?: string[];
  startTime: string;
  endTime?: string;
  creationDate?: string;
  // deletionDate?: string;
  // event_attendee
  // attendees?: User[];
  // event_format
  // format?: string;
  // organization_event
  organizations: Organization[];
  // event_resources
  resources?: Resource[];
  // event_role
  // roles?: string[];
  // event_series
  // series?: string;
  // event_tag
  // tags: string[];
  // event_task
  // tasks: Task[];
  // event_text
  description?: string;
  getInvolved?: string;
  // event_topic
  // topics: string[];
  // discussion
  discussion?: DiscussionEntry[];
  // support
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}
