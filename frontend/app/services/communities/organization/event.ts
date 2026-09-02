// SPDX-License-Identifier: AGPL-3.0-or-later
// Organization events service: plain exported functions (no composables, no state).

export async function listOrganizationEvents(
  orgId: string,
  filters: OrganizationEventFilters & Pagination = { page: 1, page_size: 10 }
): Promise<EventsPaginatedResponse> {
  try {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      query.append(key, String(value));
    });

    const res = await get<EventsResponseBody>(
      `/communities/organizations/${orgId}/events?${query.toString()}`,
      { withoutAuth: true }
    );
    return { data: res.results.map(mapEvent), isLastPage: !res.next };
  } catch (e) {
    throw errorHandler(e);
  }
}
