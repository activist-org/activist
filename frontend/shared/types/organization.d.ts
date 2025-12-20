// SPDX-License-Identifier: AGPL-3.0-or-later
// MARK: Main Table

interface OrganizationBase extends Entity {
  orgName: string;
  tagline: string;
  iconUrl?: ContentImage;
  location: PhysicalLocation;
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
  events?: CommunityEvent[];
  resources?: Resource[];
  images?: ContentImage[];
  // task?: Task[];
  // topics?: Topic[];
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}

export type OrganizationPaginatedResponse = PaginatedResponse<Organization>;

export interface Organization extends OrganizationBase {
  texts: OrganizationText[];
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
  name?: string;
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
  getInvolvedUrl?: string;
  donationPrompt: string;
}

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
