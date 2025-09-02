<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardSearchResult
    :title="event.name"
    :description="description"
    :linkUrl="linkUrl"
    :ariaLabel="ariaLabel"
    :imageUrl="imageUrl"
    :imageAlt="imageAlt"
    :entityName="entityName"
    :isExternalLink="false"
    :isReduced="isReduced"
    :isPrivate="isPrivate"
  >
    <template #image="{ imageUrl: slotImageUrl }">
      <div
        :class="{
          'h-[150px] w-[150px]': isReduced,
          'h-[200px] w-[200px]': !isReduced,
        }"
        class="flex items-center justify-center"
      >
        <ImageEvent
          :eventType="eventType"
          :imgUrl="slotImageUrl"
          :alt="imageAlt"
        />
      </div>
    </template>

    <template #menu>
      <MenuSearchResult
        class="max-md:absolute max-md:right-0 max-md:top-0"
        :event="event"
      />
    </template>

    <template #desktop-meta-tags>
      <MetaTagLocation v-if="location" :location="location" />
      <MetaTagVideo
        v-else-if="onlineLocation"
        :link="onlineLocation"
        label="i18n.components.card_search_result_event.view_video"
      />
      <MetaTagDate v-if="event.id != ''" :date="date" />
    </template>

    <template #mobile-meta-tags>
      <MetaTagLocation v-if="location" :location="location" />
      <MetaTagVideo
        v-if="onlineLocation"
        :link="onlineLocation"
        label="i18n.components.card_search_result_event.view_video"
      />
      <MetaTagDate v-if="event.id != ''" :date="date" />
    </template>

    <template #organizations>
      <MetaTagOrganization
        v-if="!isReduced && event.orgs"
        class="pt-2"
        :organization="event.orgs"
      />
    </template>
  </CardSearchResult>
</template>

<script setup lang="ts">
import type { Event } from "~/types/events/event";

import { useLinkURL } from "~/composables/useLinkURL";
import { BASE_BACKEND_URL_NO_V1 } from "~/utils/baseURLs";

const props = defineProps<{
  event: Event;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();

const i18n = useI18n();
const { linkUrl } = useLinkURL(props);

const description = computed(() => {
  return props.event.texts.description || "";
});

const ariaLabel = computed(() => {
  return i18n.t(
    "i18n.components.card_search_result_event.navigate_to_event_aria_label"
  );
});

const imageAlt = computed(() => {
  return i18n.t("i18n.components.card_search_result_event.event_img_alt_text", {
    entity_name: props.event.name,
  });
});

const entityName = computed(() => {
  // Events don't have entity names like organizations (@org_name)
  return "";
});

const eventType = computed<"action" | "learn">(() => {
  return props.event.type;
});

const imageUrl = computed(() => {
  if (props.event.iconUrl?.fileObject) {
    return `${BASE_BACKEND_URL_NO_V1}${props.event.iconUrl.fileObject}`;
  }
  return "";
});

const location = computed(() => {
  if (props.event.offlineLocation) {
    return props.event.offlineLocation.displayName.split(",")[0];
  }
  return "";
});

const onlineLocation = computed(() => {
  return props.event.onlineLocationLink || "";
});

const date = computed(() => {
  if (props.event.startTime) {
    return props.event.startTime.split("T")[0];
  }
  return "";
});
</script>
