// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Centralized Query Keys

const GROUP_KEYS = {
  root: ["group"] as const,
  byId: (id: string) => [...GROUP_KEYS.root, id] as const,
  list: (filters: unknown) =>
    [...GROUP_KEYS.root, "list", { filters }] as const,
  byImageId: (id: string) => [...GROUP_KEYS.root, "image", id] as const,
  imageList: (groupId: string) =>
    [...GROUP_KEYS.root, "imageList", groupId] as const,
};

export const useGroupCache = () => {
  const { invalidateQueries, getEntries } = useQueryCache();

  // Invalidate a single group by ID.
  const invalidateGroupCache = async (groupId: string) => {
    await invalidateQueries({
      key: GROUP_KEYS.byId(groupId),
    });
  };

  const invalidateGroupImageCache = async (groupId: string) => {
    await invalidateQueries({
      key: GROUP_KEYS.imageList(groupId),
    });
  };

  // Get cache entries for a single event.
  const groupCacheEntries = (groupId: string) =>
    getEntries({ key: GROUP_KEYS.byId(groupId) });
  const getKeyForGroups = (filters: unknown) => GROUP_KEYS.list(filters);
  const getKeyForGroup = (eventId: string) => GROUP_KEYS.byId(eventId);
  const getKeyFoGroupImage = (orgId: string) => GROUP_KEYS.byImageId(orgId);
  const getKeyForGroupListImage = (orgId: string) =>
    GROUP_KEYS.imageList(orgId);

  return {
    invalidateGroupCache,
    invalidateGroupImageCache,
    groupCacheEntries,
    getKeyForGroups,
    getKeyForGroup,
    getKeyFoGroupImage,
    getKeyForGroupListImage,
  };
};
