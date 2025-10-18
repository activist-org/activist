// SPDX-License-Identifier: AGPL-3.0-or-later
// Organizations service: plain exported functions (no composables, no state).
// Uses services/http.ts helpers and centralizes error handling + normalization.

import type {
  OrganizationCreateFormData,
  OrganizationFilters,
  OrganizationResponse,
  OrganizationsResponseBody,
  Organization as OrganizationT,
} from "~/types/communities/organization";

import { del, get, post } from "~/services/http";
import { defaultOrganizationText } from "~/types/communities/organization";
import { errorHandler } from "~/utils/errorHandler";

// MARK: Map API response to frontend type
export function mapOrganization(res: OrganizationResponse): OrganizationT {
  return {
    id: res.id,
    orgName: res.orgName,
    name: res.name,
    tagline: res.tagline,
    createdBy: res.createdBy,
    iconUrl: res.iconUrl,
    location: res.location,
    getInvolvedUrl: res.getInvolvedUrl,
    socialLinks: res.socialLinks ?? [],
    status: res.status,
    creationDate: res.creationDate,
    images: res.images ?? [],
    groups: res.groups ?? [],
    events: res.events ?? [],
    resources: res.resources ?? [],
    faqEntries: res.faqEntries ?? [],
    texts: res.texts?.[0] ?? defaultOrganizationText,
  };
}

// MARK: Get by ID
export async function getOrganization(id: string): Promise<OrganizationT> {
  try {
    const res = await get<OrganizationResponse>(
      `/communities/organizations/${id}`,
      { withoutAuth: true }
    );
    return mapOrganization(res);
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: List
export async function listOrganizations(
  filters: OrganizationFilters = {}
): Promise<OrganizationT[]> {
  try {
    const query = new URLSearchParams(filters as Record<string, string>);
    const res = await get<OrganizationsResponseBody>(
      `/communities/organizations?${query.toString()}`,
      { withoutAuth: true }
    );
    return res.results.map(mapOrganization);
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Create
export async function createOrganization(
  data: OrganizationCreateFormData
): Promise<string | false> {
  try {
    const payload = {
      name: data.name,
      location: data.location,
      tagline: data.tagline,
      social_accounts: data.social_accounts,
      description: data.description,
      topics: data.topics,
      high_risk: false,
      total_flags: 0,
      acceptance_date: new Date(),
    };
    const res = await post<OrganizationResponse, typeof payload>(
      `/communities/organizations`,
      payload
    );
    return res.id;
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Delete
export async function deleteOrganization(orgId: string): Promise<void> {
  try {
    await del(`/communities/organizations/${orgId}`);
  } catch (e) {
    throw errorHandler(e);
  }
}
