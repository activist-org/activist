<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="bg-layer-0 px-8">
    <Head>
      <Title>{{ $t("i18n.pages.organizations.index.header_title") }}</Title>
    </Head>

    <HeaderAppPage
      :header="$t('i18n.pages.organizations.index.header_title')"
      :tagline="$t('i18n.pages.organizations.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ComboboxTopics
          @update:selectedTopics="handleSelectedTopicsUpdate"
          :receivedSelectedTopics="selectedTopics"
        />
      </div>
    </HeaderAppPage>

    <Loading v-if="pending && !loadingFetchMore" 
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

      <!-- sentinel -->
      <div ref="bottomSentinel">
        <Loading v-if="loadingFetchMore && pending" 
        :loading="loadingFetchMore && pending"
        />
      </div>
    </div>

    <EmptyState v-else pageType="organizations" :permission="false" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const loadingFetchMore = ref(false);
const filters = computed<OrganizationFilters>(() => {
  const { view, ...rest } = route.query; // omit view
  return rest as unknown as OrganizationFilters;
});
const router = useRouter();
const selectedTopics = ref<TopicEnum[]>([]);
watch(
  () => route.query.topics,
  (newVal) => {
    if (Array.isArray(newVal)) {
      selectedTopics.value = newVal as TopicEnum[];
    } else if (typeof newVal === "string") {
      selectedTopics.value = [newVal as TopicEnum];
    } else {
      selectedTopics.value = [];
    }
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
const loadingFetchMore = ref(false);
const { data: organizations, pending, getMore } = useGetOrganizations(filters);
const bottomSentinel = ref<HTMLElement | null>(null);
const canFetchMore = ref(true);
const changeFetchMore = () => {
  loadingFetchMore.value = true;
};

useCustomInfiniteScroll({
  sentinel: bottomSentinel,
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
</script>
