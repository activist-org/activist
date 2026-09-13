// SPDX-License-Identifier: AGPL-3.0-or-later
// Read an organization's images with Pinia Colada. Store-first, then fetch if missing.

export function useGetOrganizationImages(id: MaybeRef<string>) {
  const orgId = computed(() => String(unref(id)));
  const enabled = computed(() => !!orgId.value);
  const store = useOrganizationImageStore();
  const { getKeyForOrganizationListImage } = useOrganizationCache();

  const { data, isLoading, error, refresh } = useQuery({
    key: () => getKeyForOrganizationListImage(orgId.value),
    query: async () => {
      const images = await fetchOrganizationImages(orgId.value);
      store.setImages(images);
      return images;
    },
    enabled,
  });
  const { handleError, error: appError } = useAppError();

  watch(error, (err) => {
    if (err) {
      handleError(err);
    }
  });

  // Callers bind to this list directly, and GroupPage gates its NuxtPage on it,
  // so keep the empty-array default rather than exposing undefined until the
  // fetch resolves.
  const images = computed<ContentImage[]>(() => data.value ?? []);

  return {
    data: images,
    pending: isLoading,
    error: appError,
    refresh: refresh ?? (() => {}),
  };
}
