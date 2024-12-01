import type { Location } from "~/types/content/location";

// MARK: Main Table

export interface Organization {
  id: string;
  orgName: string;
  name: string;
  tagline: string;
  createdBy: string;
  iconUrl: string;

  location: Location;

  getInvolvedUrl: string;
  socialLinks: string[];
  status: number;
  // statusUpdated?: string;
  // acceptanceDate?: string;
  // deletionDate?: string;

  // organization_application
  // orgsInFavor?: Organization[];
  // orgsAgainst?: Organization[];
  creationDate?: string;

  // discussion
  // discussions?: Discussion[];

  // faq
  faqEntries?: FaqEntry[];

  groups?: Group[];

  // organization_event
  events?: Event[];

  // organization_resource
  resources?: Resource[];

  // organization_task
  // task?: Task[];

  organizationTextId: string;
  texts: OrganizationText;

  // organization_topic
  // topics?: Topic[];

  // support
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}

// MARK: Bridge Tables

export interface OrganizationEvent {
  orgId: string;
  eventId: string;
}

export interface OrganizationImage {
  orgId: string;
  imageId: string;
  sequenceIndex: number;
}

export interface OrganizationMember {
  orgId: string;
  userId: string;
  isOwner: boolean;
  isAdmin: boolean;
  isComms: boolean;
}

export interface OrganizationResource {
  orgId: string;
  resourceId: string;
}

export interface OrganizationTask {
  orgId: string;
  taskId: string;
}

export interface OrganizationText {
  id: string;
  iso: string;
  primary: boolean;
  description: string;
  getInvolved: string;
  donationPrompt: string;
}

export interface OrganizationTopic {
  orgId: string;
  topicId: string;
}

// MARK: Pinia Responses

export interface PiniaResOrganization {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: Organization;
  _value: Organization;
}

export interface PiniaResOrganizations {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: Organization[];
  _value: Organization[];
}

export interface PiniaResOrganizationEvents {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: {
    count: integer;
    next: null;
    previous: null;
    results: Event[];
  };
  _value: {
    count: integer;
    next: null;
    previous: null;
    results: Event[];
  };
}

export interface PiniaResOrganizationText {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: {
    count: integer;
    next: null;
    previous: null;
    results: OrganizationText[];
  };
  _value: {
    count: integer;
    next: null;
    previous: null;
    results: OrganizationText[];
  };
}

export interface PiniaResOrganizationTexts {
  data: {
    __v_isShallow: boolean;
    __v_isRef: boolean;
    _rawValue: {
      count: number;
      next: null;
      previous: null;
      results: OrganizationText[];
    };
    _value: {
      count: number;
      next: null;
      previous: null;
      results: OrganizationText[];
    };
  };
  pending: {
    __v_isShallow: boolean;
    __v_isRef: boolean;
    _rawValue: boolean;
    _value: boolean;
  };
  error: {
    _object: { [$key: string]: null };
    _key: string;
    __v_isRef: boolean;
  };
  status: {
    __v_isShallow: boolean;
    __v_isRef: boolean;
    _rawValue: string;
    _value: string;
  };
}

// MARK: Form Data

export interface OrganizationCreateFormData {
  name: string;
  tagline: string;
  location: string;
  description: string;
  social_accounts: string[];
  topics: Topic[];
}

export interface OrganizationUpdateTextFormData {
  description: string;
  getInvolved: string;
  getInvolvedUrl: string;
}
