// SPDX-License-Identifier: AGPL-3.0-or-later
export const useOrganizationCache = () => {
  const { invalidateQueries, getEntries } = useQueryCache();

  const invalidateOrganizationCache = async (organizationId: string) => {
    await invalidateQueries({
      key: ORGANIZATION_KEYS.byId(organizationId),
    });
  };
  const invalidateOrganizationImageCache = async (organizationId: string) => {
    await invalidateQueries({
      key: ORGANIZATION_IMAGE_KEYS.byId(organizationId),
    });
  };
  const organizationCacheEntries = (organizationId: string) =>
    getEntries({ key: ORGANIZATION_KEYS.byId(organizationId) });
  return {
    invalidateOrganizationCache,
    invalidateOrganizationImageCache,
    organizationCacheEntries,
  };
};
