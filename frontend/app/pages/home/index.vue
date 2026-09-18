<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div id="home-page-main" class="bg-layer-0 px-4 pb-4 xl:px-8">
    <Head>
      <Title>{{ t("i18n._global.home") }}</Title>
    </Head>
    <HeaderAppPage
      :header="t('i18n.pages.home.index.header', { username: data?.username ?? '' })"
      :tagline="t('i18n.pages.home.index.subheader')"
    >
      <ComboboxTopics @update:selected-topics="onSelectedTopicsUpdate" class="pb-3 lg:pb-4" :selected-topics="selectedTopics"/>
    </HeaderAppPage>
    <h2>{{ t("i18n.pages.home.index.supported_events_and_organizations") }}:</h2>
     <OrganizationsList :organizations="organizations"/>

    <EventsList :events="events"/>
    <!-- <div class="space-y-6 pb-6">
      <div
        class="flex flex-col space-y-6 lg:mr-6 lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:space-x-6 lg:space-y-0"
      >
        <CardMetricsOverview
          class="lg:col-span-5"
          :metrics="{
            'total events': 123,
            'action events': 100,
            'learn events': 23,
            'new orgs': 10,
          }"
        />
        <MediaCalendar class="h-full w-full lg:col-span-2" />
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">

const selectedTopics = ref<TopicMapType[]>([]);

const { t } = useI18n();
const { data } = useGetUser();
const route = useRoute();

const onSelectedTopicsUpdate = (topics: TopicMapType[]) => {
  selectedTopics.value = topics;
};
const filterBySelectedTopics = <T extends { topics?: TopicMapType[] }>(items: T[]) => {
  return items.filter(item => selectedTopics.value.length === 0 || (item?.topics ?? []).some(topic => selectedTopics.value.includes(topic)));
};
const filterByName = <T extends { name?: string }>(items: T[], name: string) => {
  return items.filter(item => !name || (item?.name ?? '').toLowerCase().includes(name.toLowerCase()));
};
const applyFilters = <T extends { topics?: TopicMapType[]; name?: string }>(items: T[], name: string) => {
  return filterByName(filterBySelectedTopics(items), name);
};

const nameFilter = computed(() => route.query.name?.toString() ?? '');
const events = computed(() => {
  return applyFilters(data?.value?.supportedEvents ?? [], nameFilter.value);
});
const organizations = computed(() => {
  return applyFilters(data?.value?.supportedOrganizations ?? [], nameFilter.value);
});


</script>
