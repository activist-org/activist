<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ organization.name }}&nbsp;{{
          $t("i18n.pages.organizations._global.events_lower")
        }}
      </Title>
    </Head>
    <HeaderAppPageOrganization
      :header="
        organization.name +
        ' ' +
        $t('i18n.pages.organizations._global.events_lower')
      "
      :tagline="$t('i18n.pages.organizations._global.events_tagline')"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          class="w-max"
          :cta="true"
          linkTo="/"
          label="i18n._global.new_event"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages.organizations.events.new_org_event_aria_label"
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
    </HeaderAppPageOrganization>
    <div
      v-if="organization.events && organization.events.length > 0"
      class="space-y-3 py-4"
    >
      <CardSearchResultEvent
        v-for="(e, i) in organization.events"
        :key="i"
        :event="e"
        :isReduced="true"
      />
    </div>
    <EmptyState v-else pageType="events" :permission="false" class="py-4" />
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/communities/organization";

import { IconMap } from "~/types/icon-map";

defineProps<{
  organization: Organization;
}>();

const downloadCalendarEntries = () => {};
</script>
