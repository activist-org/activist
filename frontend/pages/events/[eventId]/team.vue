<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>
        {{ event.name }}&nbsp;{{ $t("i18n.pages._global.team.team_lower") }}
      </Title>
    </Head>
    <HeaderAppPage
      :event="event"
      :header="event.name + ' ' + $t('i18n.pages._global.team.team_lower')"
      :tagline="$t('i18n.pages.events.team.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="i18n.pages._global.team.invite_someone"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages.events.team.invite_someone_event_aria_label"
        />
      </div>
    </HeaderAppPage>
    <!-- <div v-if="event.members" class="space-y-3 py-4">
      <CardSearchResultUser
        v-for="(u, i) in event.members"
        :key="i"
        :isReduced="true"
        :user="u"
      />
    </div>
    <EmptyState v-else pageType="users" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(eventId);

const { event } = eventStore;
</script>
