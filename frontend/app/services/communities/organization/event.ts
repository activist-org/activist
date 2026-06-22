// SPDX-License-Identifier: AGPL-3.0-or-later
export const fetchOrganizationEvents = async (
  organizationId: string,
  filters: {
    startDate?: string;
    endDate?: string;
    name?: string;
  }
) => {
  const query = new URLSearchParams();
  if (filters.startDate) {
    query.append("startDate", filters.startDate);
  }
  if (filters.endDate) {
    query.append("endDate", filters.endDate);
  }
  if (filters.name) {
    query.append("name", filters.name);
  }

  try {
    const res = await get(
      `/communities/organizations/${organizationId}/events?${query.toString()}`,
      { withoutAuth: true }
    );
    return res.map(mapEvent);
  } catch (e) {
    throw errorHandler(e);
  }
};
