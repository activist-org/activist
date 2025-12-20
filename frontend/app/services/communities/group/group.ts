// SPDX-License-Identifier: AGPL-3.0-or-later
// Groups service: plain exported functions (no composables, no state).
// Uses services/http.ts helpers and centralizes error handling + normalization.

import { get } from "~/services/http";

// MARK: Map API Response to Type

export function mapGroup(res: GroupResponse): Group {
  return {
    id: res.id,
    images: res.images ?? [],
    groupName: res.groupName,
    name: res.name,
    tagline: res.tagline,
    org: res.org,
    createdBy: res.createdBy,
    iconUrl: res.iconUrl,
    location: res.location,
    socialLinks: res.socialLinks,
    creationDate: res.creationDate,
    events: res.events ?? [],
    resources: res.resources ?? [],
    faqEntries: res.faqEntries ?? [],
    texts: res.texts ?? [],
  };
}

// MARK: Get Group by ID

export async function getGroup(id: string): Promise<Group> {
  try {
    const res = await get<GroupResponse>(`/communities/groups/${id}`, {
      withoutAuth: true,
    });
    return mapGroup(res);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: List All Groups

export async function listGroups(
  filters: GroupFilters & Pagination = { page: 1, page_size: 10 }
): Promise<GroupPaginatedResponse> {
  try {
    const query = new URLSearchParams();
    // Handle linked_organizations specially: arrays become repeated params (?linked_organizations=A&linked_organizations=B).
    const { linked_organizations, ...rest } = filters;
    if (linked_organizations) {
      linked_organizations.forEach((t) => {
        if (!t) return;
        query.append("linked_organizations", String(t));
      });
    }
    // Add the remaining filters as single query params.
    Object.entries(rest).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      query.append(key, String(value));
    });
    const res = await get<GroupsResponseBody>(
      `/communities/groups?${query.toString()}`,
      { withoutAuth: true }
    );
    return {
      data: res.results.map(mapGroup),
      isLastPage: !res.next,
    };
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Creates Group

// export async function createGroup(data: GroupCreateFormData): Promise<GroupT> {
//   try {
//     const payload = {
//       name: data.name,
//       location: data.location,
//       tagline: data.tagline,
//       social_accounts: data.social_accounts,
//       description: data.description,
//       topics: data.topics,
//       high_risk: false,
//       total_flags: 0,
//       acceptance_date: new Date()
//     }
//     const res = await post<GroupResponse, GroupCreateFormData>(`/communities/groups`, payload)
//     return mapGroup(res)
//   } catch (e) {
//     const err = errorHandler(e)
//     showToastError(err.message)
//     throw err
//   }
// }
