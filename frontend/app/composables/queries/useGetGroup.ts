// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single group with Pinia Colada. Store-first, then fetch if missing.

export const GROUP_KEYS = {
  root: ["group"] as const,
  byId: (id: string) => [...GROUP_KEYS.root, id] as const,
};

export function useGetGroup(id: MaybeRef<string>) {
  const groupId = computed(() => String(unref(id)));
  const enabled = computed(() => !!groupId.value);
  const store = useGroupStore();
  const storeImages = useGroupImageStore();

  const { data, isLoading, error, refresh } = useQuery({
    key: () => GROUP_KEYS.byId(groupId.value),
    query: async () => {
      const group = await getGroup(groupId.value);
      store.setGroup(group);
      storeImages.setEntityId(group?.id);
      return group as Group;
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
