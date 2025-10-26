// SPDX-License-Identifier: AGPL-3.0-or-later
// Note: We need to import here to overwrite base types.
import type { Group } from "~/types/communities/group";
import type { FaqEntry } from "~/types/content/faq-entry";
import type { ContentImage } from "~/types/content/file";
import type { Location } from "~/types/content/location";
import type { Resource } from "~/types/content/resource";
import type { SocialLink } from "~/types/content/social-link";
import type { Topic, TopicEnum } from "~/types/content/topics";
import type { Entity } from "~/types/entity";
import type { Event } from "~/types/events/event";

import { defaultContentImage } from "~/types/content/file";
import { defaultSocialLink } from "~/types/content/social-link";
import { defaultLocation } from "~/types/location";

// MARK: Main Table

interface OrganizationBase extends Entity {
  orgName: string;
  tagline: string;
  iconUrl?: ContentImage;
  location: Location;
  socialLinks: OrganizationSocialLink[];
  status: number;
  // statusUpdated?: string;
  // acceptanceDate?: string;
  // deletionDate?: string;
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

export const defaultOrganizationSocialLink: OrganizationSocialLink = {
  orgId: "",
  ...defaultSocialLink,
};

export interface OrganizationText {
  id: number;
  orgId: string;
  iso: string;
  primary: boolean;
  description: string;
  getInvolved: string;
  getInvolvedUrl?: string;
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

export const defaultOrganization: Organization = {
  id: "",
  orgName: "",
  name: "",
  tagline: "",
  createdBy: "",
  iconUrl: defaultContentImage,
  location: defaultLocation,
  socialLinks: [defaultOrganizationSocialLink],
  status: 0,
  creationDate: "",
  texts: defaultOrganizationText,
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
  getInvolvedUrl?: string;
}
