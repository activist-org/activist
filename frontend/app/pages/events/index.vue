<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="bg-layer-0 px-8">
    <Head>
      <Title>{{ $t("i18n.pages.events.index.header_title") }} </Title>
    </Head>
    <HeaderAppPage
      :header="$t('i18n.pages.events.index.header_title')"
      :tagline="$t('i18n.pages.events.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ComboboxTopics />
      </div>
    </HeaderAppPage>
    <Loading
      v-if="pending && !loadingFetchMore"
      :loading="pending && !loadingFetchMore"
    />
    <div v-else-if="showEvents">
      <EventsList v-if="viewType === ViewType.LIST" :events="events" />
      <EventsMap v-else-if="viewType === ViewType.MAP" :events="events" />
      <EventsCalendar
        v-else-if="viewType === ViewType.CALENDAR"
        :events="events"
      />
      <!-- The bottom sentinel for Intersection Observer -->
      <div ref="bottomSentinel">
        <h1 v-if="loadingFetchMore && pending">
Loading...
</h1>
      </div>
    </div>
    <EmptyState v-else pageType="events" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import type { EventFilters } from "~/types/events/event";

import { useGetEvents } from "~/composables/queries/useGetEvents";
import { ViewType } from "~/types/view-types";

const viewType = ref<ViewType>(ViewType.MAP);
const route = useRoute();
const loadingFetchMore = ref(false);
const filters = computed<EventFilters>(() => {
  const { view, ...rest } = route.query; // omit view
  return rest as unknown as EventFilters;
});
watch(
  filters,
  () => {
    // Reset loading more state when filters change
    loadingFetchMore.value = false;
  },
  { immediate: true, deep: true }
);
const { data: events, pending, getMore } = useGetEvents(filters);

const bottomSentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const showEvents = computed(() => {
  if (events.value.length > 0) {
    if (loadingFetchMore.value) {
      return true;
    }
    return !pending.value;
  }
  return false;
});
onMounted(async () => {
  await nextTick();
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (
        entry?.isIntersecting &&
        !pending.value &&
        viewType.value === ViewType.LIST
      ) {
        loadingFetchMore.value = true;
        getMore();
      }
    },
    {
      root: null, // the window/viewport
      rootMargin: "0px",
      threshold: 0.1,
    }
  );
  if (bottomSentinel.value) observer.observe(bottomSentinel.value);
});

watch(
  bottomSentinel,
  (newVal) => {
    if (observer && newVal) {
      observer.observe(newVal);
    }
  },
  { immediate: true, deep: true }
);

onUnmounted(() => {
  if (observer && bottomSentinel.value) {
    observer.unobserve(bottomSentinel.value);
    observer.disconnect();
  }
});

watchEffect(() => {
  const q = route.query.view;
  if (
    typeof q === "string" &&
    Object.values(ViewType).includes(q as ViewType)
  ) {
    viewType.value = q as ViewType;
  }
});
</script>
