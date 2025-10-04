// SPDX-License-Identifier: AGPL-3.0-or-later
// Note: We need to import here to overwrite base types.
import type { Group } from "#shared/types/communities/group";
import type { FaqEntry } from "#shared/types/content/faq-entry";
import type { ContentImage } from "#shared/types/content/file";
import type { Location } from "#shared/types/content/location";
import type { Resource } from "#shared/types/content/resource";
import type { SocialLink } from "#shared/types/content/social-link";
import type { Topic, TopicEnum } from "#shared/types/content/topics";
import type { Event } from "#shared/types/events/event";

// MARK: Main Table

interface OrganizationBase {
  id: string;
  orgName: string;
  name: string;
  tagline: string;
  createdBy: string;
  iconUrl?: ContentImage;
  location: Location;
  getInvolvedUrl: string;
  socialLinks: OrganizationSocialLink[];
  status: number;
  // statusUpdated?: string;
  // acceptanceDate?: string;
  // deletionDate?: string;
  creationDate: string;
  // orgsInFavor?: Organization[];
  // orgsAgainst?: Organization[];
  // discussions?: Discussion[];
  faqEntries?: FaqEntry[];
  groups?: Group[];
  events?: Event[];
  resources?: Resource[];
  images?: ContentImage[];
  // task?: Task[];
  // topics?: Topic[];
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}

export interface Organization extends OrganizationBase {
  texts: OrganizationText;
}

// MARK: Bridge Tables

export interface OrganizationImage {
  orgId: string;
  imageId: string;
  sequenceIndex: number;
}

export interface OrganizationFilters {
  name?: string;
  location?: string;
  topics?: TopicEnum[];
}

export interface OrganizationMember {
  orgId: string;
  userId: string;
  isOwner: boolean;
  isAdmin: boolean;
  isComms: boolean;
}

export interface OrganizationSocialLink extends SocialLink {
  orgId: string;
}

export interface OrganizationText {
  id: number;
  orgId: string;
  iso: string;
  primary: boolean;
  description: string;
  getInvolved: string;
  donationPrompt: string;
}

export const defaultOrganizationText: OrganizationText = {
  id: 0,
  orgId: "",
  iso: "",
  primary: false,
  description: "",
  getInvolved: "",
  donationPrompt: "",
};

// MARK: Pinia Responses

export interface OrganizationResponse extends OrganizationBase {
  texts: OrganizationText[];
}

export interface OrganizationsResponseBody {
  count: number;
  next: number | null;
  previous: number | null;
  results: OrganizationResponse[];
}

export interface PiniaResOrganization {
  __v_isRef: boolean;
  __v_isShallow: boolean;
  _rawValue: OrganizationResponse;
  _value: OrganizationResponse;
}

export interface PiniaResOrganizations {
  __v_isRef: boolean;
  __v_isShallow: boolean;
  _rawValue: OrganizationsResponseBody;
  _value: OrganizationsResponseBody;
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
