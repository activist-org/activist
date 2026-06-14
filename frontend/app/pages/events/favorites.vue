<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="bg-layer-0 px-8">
    <Head>
      <Title>{{ $t("i18n.pages.events.favorites.header_title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('i18n.pages.events.favorites.header_title')"
      :tagline="$t('i18n.pages.events.favorites.subheader')"
    />
    <Loading v-if="pending" :loading="pending" />
    <div v-else-if="favoriteEvents.length > 0">
      <EventsList :events="favoriteEvents" />
    </div>
    <EmptyState v-else pageType="events" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import { get } from "~/services/http";

definePageMeta({
  middleware: "user-only",
});

const pending = ref(true);
const favoriteEvents = ref<CommunityEvent[]>([]);

onMounted(async () => {
  try {
    const favorites = await get<{ event: string }[]>("/events/events/favorites");
    const eventIds = favorites.map((f) => f.event);

    const eventStore = useEventStore();
    eventStore.favoritedEventIds = eventIds;

    if (eventIds.length > 0) {
      const allEventsData = await get<{ results: CommunityEvent[] }>(
        "/events/events?page_size=100"
      );
      favoriteEvents.value = allEventsData.results.filter((e) =>
        eventIds.includes(e.id)
      );
    }
  } catch (e) {
    console.error("Failed to fetch favorites:", e);
  } finally {
    pending.value = false;
  }
});
</script>