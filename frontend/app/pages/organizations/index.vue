<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="bg-layer-0 px-8">
    <Head>
      <Title>{{ $t("i18n.pages.organizations.index.header_title") }}</Title>
    </Head>
    <HeaderAppPageList
      @filter-click="removeFilter"
      :filters="listFilters"
      :header="$t('i18n.pages.organizations.index.header_title')"
      :tagline="$t('i18n.pages.organizations.index.subheader')"
    >
      <div class="flex flex-col gap-3 sm:flex-row md:hidden">
        <ComboboxTopics
          @update:selectedTopics="handleSelectedTopicsUpdate"
          class="flex-1"
          :receivedSelectedTopics="selectedTopics"
        />

        <FormSelectorComboboxCountry
          id="mobile-country-filter"
          @update:selectedCountry="handleSelectedCountryUpdate"
          class="w-32 shrink-0"
          :label="$t('i18n._global.country')"
          :selectedCountry="selectedCountry"
        />

        <FormTextInputSearch
          id="mobile-city-filter"
          @update:modelValue="
            (value: string) => {
              selectedCity = value;
              handleCityUpdate();
            }
          "
          :ariaLabel="$t('i18n._global.search_city_button_aria_label')"
          class="w-32 shrink-0"
          :label="$t('i18n._global.filter_by_city')"
          :modelValue="selectedCity"
        />
      </div>
    </HeaderAppPageList>
    <Loading
      v-if="pending && !loadingFetchMore"
      :loading="pending && !loadingFetchMore"
    />
    <div v-else-if="showOrganizations">
      <div
        v-for="org in organizations"
        :key="org.id"
        class="space-y-6 pb-6 pt-3 md:pt-4"
      >
        <CardSearchResultEntityOrganization
          :isPrivate="false"
          :organization="org"
        />
      </div>
      <div ref="bottomSentinel" class="h-px">
        <!-- The bottom sentinel for Intersection Observer. -->
        <Loading
          v-if="loadingFetchMore && pending"
          :loading="loadingFetchMore && pending"
        />
      </div>
    </div>
    <EmptyState v-else pageType="organizations" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";

const route = useRoute();
const router = useRouter();
const loadingFetchMore = ref(false);

const { getLabelByKey } = useGetLabelByKeyFilter();

const filters = computed<OrganizationFilters>(() => {
  // Note: We do not have a view filter for organizations.
  const { topics, ...rest } = route.query;
  const normalizedFilters: OrganizationFilters =
    rest as unknown as OrganizationFilters;

  // Normalize topics to always be an array (Vue Router returns string for single value).
  normalizedFilters.topics = normalizeArrayFromURLQuery(topics) as TopicEnum[];

  return normalizedFilters;
});
const selectedTopics = ref<TopicEnum[]>([]);

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
const { data: organizations, pending, getMore } = useGetOrganizations(filters);

const bottomSentinel = ref<HTMLElement | null>(null);
const canFetchMore = ref(true);
const changeFetchMore = () => {
  loadingFetchMore.value = true;
};

useCustomInfiniteScroll({
  sentinel: bottomSentinel as Ref<HTMLElement | null>,
  fetchMore: getMore,
  canFetchMore,
  callback: changeFetchMore,
});

const showOrganizations = computed(() => {
  if (organizations.value.length > 0) {
    if (loadingFetchMore.value) {
      return true;
    }
    return !pending.value;
  }
  return false;
});
const selectedCountry = ref<string>("");
const selectedCity = ref<string>("");

watch(
  () => route.query.country,
  (newVal) => {
    selectedCountry.value = (newVal as string) || "";
  },
  { immediate: true }
);

watch(
  () => route.query.city,
  (newVal) => {
    selectedCity.value = (newVal as string) || "";
  },
  { immediate: true }
);

const handleSelectedCountryUpdate = (country: string) => {
  const query = { ...route.query };

  if (country) {
    query.country = country;
  } else {
    delete query.country;
  }

  router.replace({ query });
};

const handleCityUpdate = () => {
  const query = { ...route.query };

  if (selectedCity.value) {
    query.city = selectedCity.value;
  } else {
    delete query.city;
  }

  router.replace({ query });
};
</script>
