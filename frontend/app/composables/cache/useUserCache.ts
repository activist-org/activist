// SPDX-License-Identifier: AGPL-3.0-or-later
// MARK: Centralized Query Keys

const USER_KEYS = {
  root: ["user"] as const,
  byId: (id: string) => [...USER_KEYS.root, id] as const,
};

export const useUserCache = () => {
  const { invalidateQueries, getEntries } = useQueryCache();
  const { session } = useUserSession()
  // Invalidate a single user by ID.
  const invalidateUserCache = async () => {
    if (!session.value?.user?.id) return null;
    await invalidateQueries({
      key: USER_KEYS.byId(session.value.user.id),
    });
  };

  // Get cache entries for a single user.
  const userCacheEntries = () =>
    getEntries({ key: USER_KEYS.byId(session.value?.user?.id ?? "") });
  const getKeyForUser = (userId: string) => USER_KEYS.byId(userId);

  return {
    invalidateUserCache,
    userCacheEntries,
    getKeyForUser,
  };
};
