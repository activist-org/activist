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
    <Loading v-if="pending" :loading="pending" />
    <div v-else-if="events.length > 0 && !pending">
      <EventsList v-if="viewType === ViewType.LIST" :events="events" />
      <EventsMap v-else-if="viewType === ViewType.MAP" :events="events" />
      <EventsCalendar
        v-else-if="viewType === ViewType.CALENDAR"
        :events="events"
      />
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

const filters = computed<EventFilters>(() => {
  const { view, ...rest } = route.query; // omit view
  return rest as unknown as EventFilters; // cast to your filter shape
});

const { data: events, pending } = useGetEvents(filters);

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
