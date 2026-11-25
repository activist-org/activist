// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single organization with Pinia Colada. Store-first, then fetch if missing.

export function useGetOrganization(id: MaybeRef<string>) {
  const orgId = computed(() => String(unref(id)));
  const enabled = computed(() => !!orgId.value);
  const store = useOrganizationStore();
  const imageStore = useOrganizationImageStore();
  const { getKeyForOrganization } = useOrganizationCache();

  return useCustomQuery(
    () => getKeyForOrganization(orgId.value),
    async () => {
      const organization = await getOrganization(orgId.value);
      store.setOrganization(organization);
      imageStore.setEntityId(organization?.id);
      return organization;
    },
    { enabled }
  );
}
