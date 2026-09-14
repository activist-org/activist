// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single organization with Pinia Colada. Store-first, then fetch if missing.

export function useGetUser() {
  const { user } = useUser()
  const userId = computed(() => String(user.value?.id)) ;
  const enabled = computed(() => !!userId.value);
  const { getKeyForUser } = useUserCache();

  const { data, isLoading, error, refresh } = useQuery({
    key: () => getKeyForUser(userId.value),
    query: async () => {
      const userData = await getUser(userId.value);
      console.log(userData, 'Fetched user data');
      return userData;
    },
    enabled,
  });
  const { handleError, error: appError } = useAppError();

  watch(error, (err) => {
    if (err) {
      handleError(err);
    }
  });

  return {
    data,
    pending: isLoading,
    error: appError,
    refresh: refresh ?? (() => {}),
  };
}
