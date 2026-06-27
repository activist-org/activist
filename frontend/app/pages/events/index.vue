<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="bg-layer-0 px-8">
    <Head>
      <Title>{{ $t("i18n.pages.events.index.header_title") }} </Title>
    </Head>
    <HeaderAppPageList
      @filter-click="removeFilter"
      :filters="listFilters"
      :header="$t('i18n.pages.events.index.header_title')"
      :tagline="$t('i18n.pages.events.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ComboboxTopics
          @update:selectedTopics="handleSelectedTopicsUpdate"
          :receivedSelectedTopics="selectedTopics"
        />
      </div>
    </HeaderAppPageList>
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
      <!-- The bottom sentinel for Intersection Observer. -->
      <div ref="bottomSentinel" class="h-px">
        <Loading
          v-if="loadingFetchMore && pending"
          :loading="loadingFetchMore && pending"
        />
      </div>
    </div>
    <EmptyState v-else pageType="events" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";

const route = useRoute();
const viewType = ref<ViewType>((route.query.view as ViewType) || ViewType.LIST);
const router = useRouter();
const loadingFetchMore = ref(false);
const { getLabelByKey } = useGetLabelByKeyFilter();
const filters = computed<EventFilters>(() => {
  const { view, topics, ...rest } = route.query; // omit view
  const normalizedFilters: EventFilters = rest as unknown as EventFilters;

  // Normalize topics to always be an array (Vue Router returns string for single value).
  normalizedFilters.topics = normalizeArrayFromURLQuery(topics) as TopicEnum[];

  if (normalizedFilters.days_ahead) {
    normalizedFilters.days_ahead = +normalizedFilters.days_ahead;
  }

  return normalizedFilters;
});
const listFilters = computed(() => {
  const mappedFilters = Object.entries(filters.value).flatMap(
    ([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => ({
          id: `${key}-${v}`,
          label: (getLabelByKey(key, v) ||
            String(v).replace(/_/g, " ")) as string,
          value: v,
        }));
      }
      return {
        id: key,
        label: (getLabelByKey(key, value) ||
          String(value).replace(/_/g, " ")) as string,
        value,
      };
    }
  );
  return mappedFilters;
});

const removeFilter = (option: {
  id: number | string;
  label: string;
  value: unknown;
}) => {
  const key = option.id.toString().split("-")[0];
  if (!key) return;

  const query = { ...route.query } as OrganizationFilters &
    Record<string, unknown>;
  const current = query[key];

  if (Array.isArray(current)) {
    const next = current.filter((v) => String(v) !== String(option.value));
    if (next.length > 0) {
      router.replace({
        query: { ...query, [key]: next } as LocationQueryRaw,
      });
      return;
    }
  }

  // Remove key without dynamic delete.
  const { [key]: _removed, ...rest } = query;
  router.replace({ query: rest as LocationQueryRaw });
};

const selectedTopics = ref<TopicEnum[]>([]);
watch(
  () => route.query.topics,
  (newVal) => {
    selectedTopics.value = normalizeArrayFromURLQuery(newVal) as TopicEnum[];
  },
  { immediate: true }
);
const handleSelectedTopicsUpdate = (selectedTopics: TopicEnum[]) => {
  const query = { ...route.query };
  if (selectedTopics.length > 0) {
    query.topics = selectedTopics;
  } else {
    delete query.topics;
  }
  router.replace({ query });
};

watch(
  filters,
  () => {
    // Reset loading more state when filters change.
    loadingFetchMore.value = false;
  },
  { immediate: true, deep: true }
);
const { data: events, pending, getMore } = useGetEvents(filters);

const bottomSentinel = ref<HTMLElement | null>(null);
const canFetchMore = computed(() => viewType.value === ViewType.LIST);
const changeFetchMore = () => {
  loadingFetchMore.value = true;
};

useCustomInfiniteScroll({
  sentinel: bottomSentinel as Ref<HTMLElement | null>,
  fetchMore: getMore,
  canFetchMore,
  callback: changeFetchMore,
});

const showEvents = computed(() => {
  if (events.value.length > 0) {
    if (loadingFetchMore.value) {
      return true;
    }
    return !pending.value;
  }
  return false;
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
