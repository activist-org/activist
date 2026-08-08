// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Centralized Query Keys

const ORGANIZATION_KEYS = {
  root: ["organization"] as const,
  byId: (id: string) => [...ORGANIZATION_KEYS.root, id] as const,
  list: (filters: unknown) =>
    [...ORGANIZATION_KEYS.root, "list", { filters }] as const,
  byImageId: (id: string) => [...ORGANIZATION_KEYS.root, "image", id] as const,
  imageList: (orgId: string) =>
    [...ORGANIZATION_KEYS.root, "imageList", orgId] as const,
  listByUser: (userId: string, filters: unknown) =>
    [...ORGANIZATION_KEYS.root, "list", "user", userId, { filters }] as const,
};

export const useOrganizationCache = () => {
  const { invalidateQueries, getEntries } = useQueryCache();

  // Invalidate a single organization by ID.
  const invalidateOrganizationCache = async (organizationId: string) => {
    await invalidateQueries({
      key: ORGANIZATION_KEYS.byId(organizationId),
    });
  };

  const invalidateOrganizationImageCache = async (organizationId: string) => {
    await invalidateQueries({
      key: ORGANIZATION_KEYS.imageList(organizationId),
    });
  };

  const invalidateOrganizationList = async () => {
    await invalidateQueries({
      key: [...ORGANIZATION_KEYS.root, "list"],
    });
  };

  const invalidateOrganizationsByUser = async (userId: string) => {
    await invalidateQueries({
      key: [...ORGANIZATION_KEYS.root, "list", "user", userId],
    });
  };

  // Get cache entries for a single event.
  const organizationCacheEntries = (organizationId: string) =>
    getEntries({ key: ORGANIZATION_KEYS.byId(organizationId) });
  const getKeyForOrganizations = (filters: unknown) =>
    ORGANIZATION_KEYS.list(filters);
  const getKeyForOrganization = (orgId: string) =>
    ORGANIZATION_KEYS.byId(orgId);
  const getKeyForOrganizationsByUser = (userId: string, filters: unknown) =>
    ORGANIZATION_KEYS.listByUser(userId, filters);
  const getKeyForOrganizationImage = (orgId: string) =>
    ORGANIZATION_KEYS.byImageId(orgId);
  const getKeyForOrganizationListImage = (orgId: string) =>
    ORGANIZATION_KEYS.imageList(orgId);

  return {
    invalidateOrganizationCache,
    invalidateOrganizationImageCache,
    invalidateOrganizationList,
    invalidateOrganizationsByUser,
    organizationCacheEntries,
    getKeyForOrganizations,
    getKeyForOrganization,
    getKeyForOrganizationsByUser,
    getKeyForOrganizationImage,
    getKeyForOrganizationListImage,
  };
};
