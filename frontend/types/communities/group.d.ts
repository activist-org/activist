import type { Location } from "~/types/content/location";

// MARK: Main Table

interface GroupBase {
  id: string;
  groupName: string;
  name: string;
  tagline: string;
  createdBy: User;
  iconUrl?: string;
  location: Location;
  getInvolvedUrl: string;
  socialLinks: string[];
  creationDate: string;
  org: GroupOrganization;
  groupTextId: string;
  events?: Event[];
  faqEntries?: FaqEntry[];
  resources?: Resource[];
  // topics?: Topic[];
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}

export interface Group extends GroupBase {
  texts: GroupText;
}

// MARK: Bridge Tables

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

export interface GroupText {
  groupId: string;
  iso: string;
  primary: boolean;
  description: string;
  getInvolved: string;
  donationPrompt: string;
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
