// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Composable for implementing custom infinite scroll functionality in a Vue component. This composable uses the Intersection Observer API to detect when a specified sentinel element comes into view, triggering a callback function to fetch more data. The composable accepts various options to customize its behavior, including enabling or disabling the infinite scroll, setting thresholds for when to trigger the fetch, and providing a callback function to execute after fetching more data. It also manages the lifecycle of the Intersection Observer, ensuring that it is properly set up and cleaned up as needed.
 * @param options An object containing the configuration options for the infinite scroll functionality. This includes a reference to the sentinel element to observe, a function to fetch more data when the sentinel comes into view, optional reactive references to control whether more data can be fetched and whether the infinite scroll is enabled, as well as optional parameters for the Intersection Observer such as threshold and root margin. Additionally, an optional callback function can be provided to execute after fetching more data.
 * @param options.sentinel A reactive reference to the HTML element that serves as the sentinel for the Intersection Observer. When this element comes into view, the fetchMore function will be triggered to load more data.
 * @param options.fetchMore A function that is called to fetch more data when the sentinel element comes into view. This function should contain the logic to load additional data and update the component's state accordingly.
 * @param options.canFetchMore An optional reactive reference that indicates whether more data can be fetched. This can be used to prevent further fetches when there is no more data available, ensuring that the fetchMore function is only called when necessary.
 * @param options.enabled An optional reactive reference that controls whether the infinite scroll functionality is enabled. This allows you to dynamically enable or disable the infinite scroll behavior based on certain conditions in your component.
 * @param options.threshold An optional parameter that specifies the threshold for the Intersection Observer. This can be a single number or an array of numbers that indicate at what percentage of the sentinel's visibility the fetchMore function should be triggered. The default value is 0.1, meaning that the fetchMore function will be called when the sentinel is at least 10% visible.
 * @param options.rootMargin An optional parameter that specifies the root margin for the Intersection Observer. This can be used to adjust the bounding box of the root element, allowing you to trigger the fetchMore function earlier or later than when the sentinel actually comes into view. The default value is "0px", meaning that the fetchMore function will be triggered when the sentinel is exactly in view.
 * @param options.callback An optional callback function that is executed after the fetchMore function is called. This can be used to perform any additional actions needed after fetching more data, such as updating the UI or logging analytics events
 */
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
    if (sentinel.value && observer.value) {
      observer.value.observe(sentinel.value);
    }
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
