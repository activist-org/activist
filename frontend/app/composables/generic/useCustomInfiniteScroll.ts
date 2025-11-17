// SPDX-License-Identifier: AGPL-3.0-or-later
export function useCustomInfiniteScroll(options: {
  sentinel: Ref<HTMLElement | null>;
  fetchMore: () => void;
  canFetchMore?: Ref<boolean>;
  enabled?: Ref<boolean>;
  threshold?: number | number[];
  rootMargin?: string;
  callback?: () => void;
}) {
  const observer = ref<IntersectionObserver | null>(null);
  const {
    sentinel,
    fetchMore,
    enabled = ref(true),
    threshold = 0.1,
    rootMargin = "0px",
    canFetchMore,
  } = options;

  onMounted(async () => {
    await nextTick();
    observer.value = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && enabled.value && canFetchMore?.value) {
          fetchMore();
          options.callback?.();
        }
      },
      { root: null, threshold, rootMargin }
    );
    if (sentinel.value) observer.value.observe(sentinel.value);
  });

  watch(
    sentinel,
    (newVal) => {
      if (observer.value && newVal) observer.value.observe(newVal);
    },
    { immediate: true }
  );

  onUnmounted(() => {
    if (observer.value && sentinel.value) {
      observer.value.unobserve(sentinel.value);
      observer.value.disconnect();
    }
  });
}
