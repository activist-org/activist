<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MenuSubPageSelector
    class="pt-2 md:pt-0"
    :selectors="groupSubPages"
    :selectedRoute="1"
  />
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>
        {{ group.name }}&nbsp;{{
          $t("i18n.pages.organizations._global.events_lower")
        }}
      </Title>
    </Head>
    <HeaderAppPageGroup
      :header="
        group.name + ' ' + $t('i18n.pages.organizations._global.events_lower')
      "
      :tagline="$t('i18n.pages.organizations._global.events_tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnRouteInternal
          class="w-max"
          :cta="true"
          linkTo="/"
          label="i18n._global.new_event"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages.organizations.groups.events.new_group_event_aria_label"
        />
        <BtnAction
          @click="downloadCalendarEntries"
          @keydown.enter="downloadCalendarEntries"
          class="w-max"
          :cta="true"
          label="i18n.pages.organizations._global.subscribe_to_events"
          fontSize="sm"
          :leftIcon="IconMap.DATE"
          iconSize="1.25em"
          ariaLabel="i18n.pages.organizations._global.subscribe_to_events_aria_label"
        />
      </div>
    </HeaderAppPageGroup>
    <PagePreviewEvent />
    <div v-if="group.events" class="space-y-3 py-4">
      <CardSearchResultEvent
        v-for="(u, i) in group.events"
        :key="i"
        :isReduced="true"
        :event="u"
      />
    </div>
    <EmptyState v-else pageType="events" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import type { Group } from "~/types/communities/group";

import { IconMap } from "~/types/icon-map";

defineProps<{
  group: Group;
}>();

const groupSubPages = getGroupSubPages();

const downloadCalendarEntries = () => {};
</script>
