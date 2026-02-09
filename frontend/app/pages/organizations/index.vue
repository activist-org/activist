<template>
  <div class="bg-layer-0 px-8">
    <Head>
      <Title>{{ $t("i18n.pages.organizations.index.header_title") }}</Title>
    </Head>

    <HeaderAppPage
      :header="$t('i18n.pages.organizations.index.header_title')"
      :tagline="$t('i18n.pages.organizations.index.subheader')"
    >
      <filterOrgs 
        class="w-full max-w-8xl"
        :selected-topics="selectedTopics"
        :status="selectedStatus"
        :search-query="searchQuery"
        @update:selected-topics="handleSelectedTopicsUpdate"
        @update:status="handleStatusUpdate"
        @update:search="handleSearchUpdate"
      />
    </HeaderAppPage>

    <Loading
      v-if="pending && !loadingFetchMore"
      :loading="pending && !loadingFetchMore"
    />
    <div>
      <div v-if="showOrganizations">
        <div
          v-for="org in filteredOrganizations"
          :key="org.id"
          class="space-y-6 pb-6 pt-3 md:pt-4"
        >
          <CardSearchResultEntityOrganization
            :isPrivate="false"
            :organization="org"
          />
        </div>
      </div>
      
      <EmptyState v-else-if="!pending" pageType="organizations" :permission="false" />

      <div ref="bottomSentinel" class="h-1">
        <Loading
          v-if="loadingFetchMore && pending"
          :loading="loadingFetchMore && pending"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TopicEnum } from '~/types';
import type { OrganizationFilters } from '~/types';

const route = useRoute();
const router = useRouter();
const loadingFetchMore = ref(false);

import filterOrgs from "~/components/filter/filterOrgs.vue";

// Reactive state for all filters
const selectedTopics = ref<TopicEnum[]>([]);
const selectedStatus = ref<string>('active');
const searchQuery = ref<string>('');

// Initialize from URL query params
watch(
  () => route.query,
  (newQuery) => {
    selectedTopics.value = normalizeArrayFromURLQuery(newQuery.topics) as TopicEnum[];
    selectedStatus.value = (newQuery.status as string) || 'active';
    searchQuery.value = (newQuery.search as string) || '';
  },
  { immediate: true }
);

// Computed filters for API (without search since we'll filter frontend)
const filters = computed<OrganizationFilters>(() => {
  const normalizedFilters: OrganizationFilters = {
    topics: selectedTopics.value,
    status: selectedStatus.value,
    // Remove search from API call - we'll filter on frontend
  };

  return normalizedFilters;
});

// Frontend filtering for search
const filteredOrganizations = computed(() => {
  if (!searchQuery.value || !searchQuery.value.trim()) {
    // No search query - return all organizations
    return organizations.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  
  return organizations.value.filter(org => {
    // Search in name, org_name, tagline, and description
    const searchableText = [
      org.name,
      org.orgName,
      org.tagline,
      org.description
    ]
      .filter(Boolean) // Remove null/undefined values
      .join(' ')
      .toLowerCase();
    
    return searchableText.includes(query);
  });
});

// Update URL when filters change
const updateURLQuery = () => {
  const query: any = { ...route.query };
  
  if (selectedTopics.value.length > 0) {
    query.topics = selectedTopics.value;
  } else {
    delete query.topics;
  }
  
  if (selectedStatus.value && selectedStatus.value !== 'active') {
    query.status = selectedStatus.value;
  } else {
    delete query.status;
  }
  
  if (searchQuery.value && searchQuery.value.trim()) {
    query.search = searchQuery.value;
  } else {
    delete query.search;
  }
  
  router.replace({ query });
};

// Handlers for filter updates
const handleSelectedTopicsUpdate = (topics: TopicEnum[]) => {
  selectedTopics.value = topics;
  updateURLQuery();
};

const handleStatusUpdate = (status: string) => {
  selectedStatus.value = status;
  updateURLQuery();
};

const handleSearchUpdate = (search: string) => {
  searchQuery.value = search;
  updateURLQuery();
};

watch(
  filters,
  () => {
    // Reset loading more state when filters change
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
  if (filteredOrganizations.value.length > 0) {
    if (loadingFetchMore.value) {
      return true;
    }
    return !pending.value;
  }
  return false;
});
</script>