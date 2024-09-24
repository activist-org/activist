<template>
  <div
    class="bg-light-layer-0 px-8 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages.events.index.header_title") }} </Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.events.index.header_title')"
      :tagline="$t('pages.events.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ComboboxTopics />
      </div>
    </HeaderAppPage>
    <div v-if="events.length > 0">
      <div v-for="event in events" class="space-y-6 pb-6 pt-3 md:pt-4">
        <CardSearchResultEvent :isPrivate="false" :event="event" />
      </div>
    </div>
    <EmptyState v-else pageType="events" :permission="false" />
  </div>
</template>

<script setup lang="ts">
const eventStore = useEventStore();
await eventStore.fetchAll();

const { events } = eventStore;
</script>
