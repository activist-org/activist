// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Centralized Query Keys
const ORGANIZATION_KEYS = {
  root: ["organization"] as const,
  byId: (id: string) => [...ORGANIZATION_KEYS.root, id] as const,
  list: (filters: unknown) =>
    [...ORGANIZATION_KEYS.root, "list", { filters }] as const,
  listByUser: (userId: string, filters: unknown) =>
    [...ORGANIZATION_KEYS.root, "list", "user", userId, { filters }] as const,
};

export const useOrganizationCache = () => {
  const { invalidateQueries, getEntries } = useQueryCache();

  // Invalidate a single organization by ID
  const invalidateOrganizationCache = async (organizationId: string) => {
    await invalidateQueries({
      key: ORGANIZATION_KEYS.byId(organizationId),
    });
  };

  // Invalidate all organization lists (useful when creating or deleting an organization)
  const invalidateOrganizationList = async () => {
    await invalidateQueries({
      key: [...ORGANIZATION_KEYS.root, "list"],
    });
  };

  // Get cache entries for a single organization
  const organizationCacheEntries = (organizationId: string) =>
    getEntries({ key: ORGANIZATION_KEYS.byId(organizationId) });
  const getKeyForGetOrganizations = (filters: unknown) =>
    ORGANIZATION_KEYS.list(filters);
  const getKeyForGetOrganization = (organizationId: string) =>
    ORGANIZATION_KEYS.byId(organizationId);
  const getKeyForGetOrganizationsByUser = (userId: string, filters: unknown) =>
    ORGANIZATION_KEYS.listByUser(userId, filters);

  return {
    invalidateOrganizationCache,
    invalidateOrganizationList,
    organizationCacheEntries,
    getKeyForGetOrganizations,
    getKeyForGetOrganization,
    getKeyForGetOrganizationsByUser,
  };
};
