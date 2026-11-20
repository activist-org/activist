// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a group's images with Pinia Colada. Store-first, then fetch if missing.

export function useGetGroupImages(id: MaybeRef<string>) {
  const groupId = computed(() => String(unref(id)));
  const enabled = computed(() => !!groupId.value);
  const store = useGroupImageStore();
  const { getKeyForGroupListImage } = useGroupCache();

  const key = computed(() => getKeyForGroupListImage(groupId.value));

  const { data, pending, error, refresh } = useCustomQuery<ContentImage[]>(
    key,
    async () => {
      const images = await fetchGroupImages(groupId.value);
      store.setImages(images);
      return images;
    },
    enabled
  );

  // Callers bind to this list directly, and GroupPage gates its NuxtPage on it,
  // so keep the empty-array default rather than exposing undefined until the
  // fetch resolves.
  const images = computed<ContentImage[]>(() => data.value ?? []);

  return {
    data: images,
    pending,
    error,
    refresh,
  };
}
