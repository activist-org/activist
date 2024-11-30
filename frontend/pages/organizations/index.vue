<template>
  <div class="bg-layer-0 px-8 text-primary-text">
    <Head>
      <Title>{{ $t("pages.organizations.index.header_title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.organizations.index.header_title')"
      :tagline="$t('pages.organizations.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ComboboxTopics />
      </div>
    </HeaderAppPage>
    <div class="mb-8">
      <PageFilter @filter-change="handleFilterChange" :sections="filterSections" :tabs="tabs" />
    </div>
    <div v-if="organizations.length > 0">
      <div v-for="org in organizations" class="space-y-6 pb-6 pt-3 md:pt-4">
        <CardSearchResultOrganization :isPrivate="false" :organization="org" />
      </div>
    </div>
    <EmptyState v-else pageType="organizations" :permission="false" />
  </div>
</template>

<script setup lang="ts">
const filterSections = ref([
  {
    title: 'Popular tags',
    tags: [
      { id: 1, name: 'Framework', selected: false },
      { id: 2, name: 'Library', selected: false },
      { id: 3, name: 'Tool', selected: false },
    ]
  }
])

const tabs = ref([
  { id: 'active', name: 'Active' },
  { id: 'new', name: 'New' },
  { id: 'private', name: 'Private' }
]);

const handleFilterChange = (filters: any) => {
  console.log('Filters changed:', filters);
  // You can implement the filtering logic here later
};

const organizationStore = useOrganizationStore();
await organizationStore.fetchAll();

const { organizations } = organizationStore;
</script>
