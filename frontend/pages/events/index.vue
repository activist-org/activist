<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="bg-layer-0 px-8 text-primary-text">
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
    <div v-if="events.length > 0">
      <EventsList
        v-if="viewType === ViewType.LIST"
        :events="events"
        />
        <EventsMap
        v-else-if="viewType === ViewType.MAP"
        :events="events"
        />
        <EmptyState v-else pageType="events" :permission="false" />
    </div>
    <EmptyState v-else pageType="events" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/events/event";

import { ViewType } from '~/types/view-types';

const viewType = ref<ViewType>(ViewType.MAP);
const route = useRoute();

watchEffect(() => {
  const q = route.query.view;
  if (typeof q === 'string' && Object.values(ViewType).includes(q as ViewType)) {
    viewType.value = q as ViewType;
  }
});
defineProps<{
  events: Event[];
}>();
</script>
