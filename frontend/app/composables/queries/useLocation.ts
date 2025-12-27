// SPDX-License-Identifier: AGPL-3.0-or-later

export const getKeyForLocation = (query: Record<string, string> | null) => `user-location:${JSON.stringify(query)}`;
export const useLocation = (query: MaybeRef<Record<string, string> | null>) => {
  const { showToastError } = useToaster()
  const queryRef = computed(() => unref(query))
  const { pending, error, data, refresh } = useAsyncData<NomatimLocation[] | null>(
    () => getKeyForLocation(queryRef.value),
    async () => {
      try {
        if (!queryRef.value || Object.keys(queryRef.value).length === 0) {
          return null
        }
        const location = await searchLocationNomatim(queryRef.value)
        return location
      } catch (error) {
        showToastError((error as AppError).message)
        throw error
      }
    },
    {
      immediate: true,
      dedupe: "defer",
      watch: [queryRef],
      default: () => null,
    }
  )

  return {
    pending,
    error,
    data,
    refresh
  }
}
