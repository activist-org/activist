<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style flex h-full flex-col gap-4 px-5 py-5">
    <div class="flex items-start gap-3">
      <Icon :name="IconMap.GLOBE" size="1.5em" />
      <div class="flex flex-col">
        <span
          class="text-xs font-semibold uppercase tracking-wide text-secondary-text"
        >
          {{ $t("i18n.components._global.location_type_online") }}
        </span>
        <h3 class="font-display text-lg leading-tight">
          {{ event.name }}
        </h3>
        <p v-if="event.tagline" class="text-sm text-secondary-text">
          {{ event.tagline }}
        </p>
      </div>
    </div>
    <div v-if="event.onlineLocationLink" class="flex flex-col gap-2">
      <span class="break-all text-sm font-medium text-primary-text">
        {{ event.onlineLocationLink }}
      </span>
      <BtnRouteExternal
        ariaLabel="i18n.components.machine_steps_create_event_link_online.link_to_event"
        class="w-max"
        :cta="true"
        fontSize="sm"
        iconSize="1.35em"
        label="i18n.components.machine_steps_create_event_link_online.link_to_event"
        :linkTo="event.onlineLocationLink"
        :rightIcon="IconMap.ARROW_RIGHT"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "#shared/types/icon-map";

const props = defineProps<{
  event: CommunityEvent;
}>();

const { event } = toRefs(props);
</script>
