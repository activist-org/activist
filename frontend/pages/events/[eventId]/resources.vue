<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>
        {{ event.name }}&nbsp;{{ $t("i18n._global.resources_lower") }}
      </Title>
    </Head>
    <HeaderAppPage
      :event="event"
      :header="event.name + ' ' + $t('i18n._global.resources_lower')"
      :tagline="$t('i18n.pages.events.resources.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          class="w-max"
          :cta="true"
          linkTo="/"
          label="i18n._global.new_resource"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages._global.resources.new_resource_aria_label"
        />
      </div>
    </HeaderAppPage>
    <div v-if="event.resources" class="space-y-3 py-4">
      <CardSearchResultResource
        v-for="(r, i) in event.resources"
        :key="i"
        :isReduced="true"
        :resource="r"
      />
    </div>
    <EmptyState v-else pageType="resources" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/events/event";

import { IconMap } from "~/types/icon-map";

defineProps<{
  event: Event;
}>();
</script>
