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
  eventsList: (orgId: string, filters: unknown) =>
    [...ORGANIZATION_KEYS.root, orgId, "events", { filters }] as const,
};

export const useOrganizationCache = () => {
  const { invalidateQueries, getEntries } = useQueryCache();

  // Invalidate a single organization by ID.
  const invalidateOrganizationCache = async (orgId: string) => {
    await invalidateQueries({
      key: ORGANIZATION_KEYS.byId(orgId),
    });
  };

  const invalidateOrganizationImageCache = async (orgId: string) => {
    await invalidateQueries({
      key: ORGANIZATION_KEYS.imageList(orgId),
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

  const invalidateOrganizationEvents = async (orgId: string) => {
    await invalidateQueries({
      key: [...ORGANIZATION_KEYS.root, orgId, "events"],
    });
  };

  // Get cache entries for a single event.
  const organizationCacheEntries = (orgId: string) =>
    getEntries({ key: ORGANIZATION_KEYS.byId(orgId) });
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
  const getKeyForOrganizationEvents = (orgId: string, filters: unknown) =>
    ORGANIZATION_KEYS.eventsList(orgId, filters);

  return {
    invalidateOrganizationCache,
    invalidateOrganizationImageCache,
    invalidateOrganizationList,
    invalidateOrganizationsByUser,
    invalidateOrganizationEvents,
    organizationCacheEntries,
    getKeyForOrganizations,
    getKeyForOrganization,
    getKeyForOrganizationsByUser,
    getKeyForOrganizationImage,
    getKeyForOrganizationListImage,
    getKeyForOrganizationEvents,
  };
};
