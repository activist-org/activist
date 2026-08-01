// SPDX-License-Identifier: AGPL-3.0-or-later
export const useGroupCache = () => {
  const { invalidateQueries, getEntries } = useQueryCache();

  const invalidateGroupCache = async (groupId: string) => {
    await invalidateQueries({
      key: GROUP_KEYS.byId(groupId),
    });
  };
  const invalidateGroupImageCache = async (groupId: string) => {
    await invalidateQueries({
      key: GROUP_IMAGE_KEYS.byId(groupId),
    });
  };
  const groupCacheEntries = (groupId: string) =>
    getEntries({ key: GROUP_KEYS.byId(groupId) });
  return { invalidateGroupCache, invalidateGroupImageCache, groupCacheEntries };
};
