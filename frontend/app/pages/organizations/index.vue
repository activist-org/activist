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
        <ComboboxTopics />
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

watch(
  filters,
  () => {
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
