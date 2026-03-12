// SPDX-License-Identifier: AGPL-3.0-or-later
// Organizations service: plain exported functions (no composables, no state).
// Uses services/http.ts helpers and centralizes error handling + normalization.

// MARK: Map API Response to Type

export function mapOrganization(res: OrganizationResponse): Organization {
  return {
    id: res.id,
    orgName: res.orgName,
    name: res.name,
    tagline: res.tagline,
    createdBy: res.createdBy,
    iconUrl: res.iconUrl,
    location: res.location,
    socialLinks: res.socialLinks ?? [],
    status: res.status,
    creationDate: res.creationDate,
    images: res.images ?? [],
    groups: res.groups ?? [],
    events: res.events ?? [],
    resources: res.resources ?? [],
    faqEntries: res.faqEntries ?? [],
    texts: res.texts ?? [],
  };
}

// MARK: Get by ID

export async function getOrganization(id: string): Promise<Organization> {
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

// MARK: List by User ID

export async function listOrganizationsByUserId(
  userId: string,
  page: number,
  filters?: OrganizationFilters
): Promise<OrganizationPaginatedResponse> {
  try {
    const query = new URLSearchParams();
    if (filters) {
      // Handle topics specially: arrays become repeated params (?topics=A&topics=B).
      const { topics, ...rest } = filters ?? {};
      if (topics) {
        topics.forEach((t) => {
          if (!t) return;
          query.append("topics", String(t));
        });
      }
      // Add the remaining filters as single query params.
      Object.entries(rest).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        query.append(key, String(value));
      });
    }
    const res = await get<OrganizationsResponseBody>(
      `/communities/organizations_by_user/${userId}?page=${page}${filters ? `&${query.toString()}` : ""}`
    );
    return { data: res.results.map(mapOrganization), isLastPage: !res.next };
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Create

export async function createOrganization(
  data: CreateOrganizationInput
): Promise<string> {
  try {
    const res = await post<string, typeof data>(
      `/communities/organizations`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    return res;
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: List All

export async function listOrganizations(
  filters: OrganizationFilters & Pagination = { page: 1, page_size: 10 }
): Promise<OrganizationPaginatedResponse> {
  try {
    const query = new URLSearchParams();
    // Handle topics specially: arrays become repeated params (?topics=A&topics=B).
    const { topics, ...rest } = filters;
    if (topics) {
      topics.forEach((t) => {
        if (!t) return;
        query.append("topics", String(t));
      });
    }
    // Add the remaining filters as single query params.
    Object.entries(rest).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      query.append(key, String(value));
    });
    const res = await get<OrganizationsResponseBody>(
      `/communities/organizations?${query.toString()}`,
      { withoutAuth: true }
    );
    return { data: res.results.map(mapOrganization), isLastPage: !res.next };
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
