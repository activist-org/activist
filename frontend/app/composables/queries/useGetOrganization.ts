// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single organization with Pinia Colada. Store-first, then fetch if missing.

export function useGetOrganization(id: MaybeRef<string>) {
  const organizationId = computed(() => String(unref(id)));
  const enabled = computed(() => !!organizationId.value);
  const store = useOrganizationStore();
  const imageStore = useOrganizationImageStore();
  const { getKeyForOrganization } = useOrganizationCache();

  const { data, isLoading, error, refresh } = useQuery({
    key: () => getKeyForOrganization(organizationId.value),
    query: async () => {
      const organization = await getOrganization(organizationId.value);
      store.setOrganization(organization);
      imageStore.setEntityId(organization?.id);
      return organization;
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
