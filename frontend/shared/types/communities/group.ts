// SPDX-License-Identifier: AGPL-3.0-or-later
// Note: We need to import here to overwrite base types.
import type { User } from "#shared/types/auth/user";
import type { Organization } from "#shared/types/communities/organization";
import type { FaqEntry } from "#shared/types/content/faq-entry";
import type { ContentImage } from "#shared/types/content/file";
import type { Location } from "#shared/types/content/location";
import type { Resource } from "#shared/types/content/resource";
import type { SocialLink } from "#shared/types/content/social-link";
import type { Topic } from "#shared/types/content/topics";
import type { Event } from "#shared/types/events/event";

// MARK: Main Table

interface GroupBase {
  id: string;
  groupName: string;
  name: string;
  tagline: string;
  createdBy: User;
  iconUrl?: ContentImage;
  location: Location;
  getInvolvedUrl: string;
  socialLinks: GroupSocialLink[];
  creationDate: string;
  org: Organization;
  events?: Event[];
  faqEntries?: FaqEntry[];
  resources?: Resource[];
  images?: ContentImage[];
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

export interface GroupSocialLink extends SocialLink {
  groupId: string;
}

export interface GroupText {
  id: number;
  groupId: string;
  iso: string;
  primary: boolean;
  description: string;
  getInvolved: string;
  donationPrompt: string;
}

export const defaultGroupText: GroupText = {
  id: 0,
  groupId: "",
  iso: "",
  primary: false,
  description: "",
  getInvolved: "",
  donationPrompt: "",
};

// MARK: Pinia Responses

export interface GroupResponse extends GroupBase {
  texts: GroupText[];
}

export interface GroupsResponseBody {
  count: number;
  next: number | null;
  previous: number | null;
  results: GroupResponse[];
}

export interface PiniaResGroup {
  __v_isRef: boolean;
  __v_isShallow: boolean;
  _rawValue: GroupResponse;
  _value: GroupResponse;
}
export interface PiniaResGroups {
  __v_isRef: boolean;
  __v_isShallow: boolean;
  _rawValue: GroupsResponseBody;
  _value: GroupsResponseBody;
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
