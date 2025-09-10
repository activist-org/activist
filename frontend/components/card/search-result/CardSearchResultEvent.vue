<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="card-style flex flex-col justify-center px-3 py-4 md:grow md:flex-row md:justify-start md:py-3 lg:px-5"
  >
    <div class="relative flex w-full flex-col md:flex-row">
      <div class="flex w-full justify-center md:w-fit">
        <NuxtLink :to="localePath(linkUrl)" :aria-label="ariaLabel">
          <div class="h-min w-max rounded-md border border-section-div bg-layer-0">
            <div
              :class="{
                'h-[150px] w-[150px]': isReduced,
                'h-[200px] w-[200px]': !isReduced,
              }"
              class="flex items-center justify-center"
            >
              <ImageEvent
                :eventType="eventType"
                :imgUrl="imageUrl"
                :alt="
                  $t('i18n.components.card_search_result.event_img_alt_text', {
                    entity_name: event.name,
                  })
                "
              />
            </div>
          </div>
        </NuxtLink>
      </div>
      <div class="flex-col space-y-2 pt-3 md:grow md:pl-4 md:pt-0 lg:pl-6">
        <div class="-mb-2 flex flex-col justify-between md:flex-row">
          <div class="flex items-center justify-center space-x-2 md:space-x-4">
            <NuxtLink :to="localePath(linkUrl)" :aria-label="ariaLabel">
              <h3 class="font-bold">{{ event.name }}</h3>
            </NuxtLink>
            <MenuSearchResult
              class="max-md:absolute max-md:right-0 max-md:top-0"
              :event="event"
            />
          </div>
          <div
            v-if="aboveMediumBP"
            class="flex items-center space-x-3 lg:space-x-5"
          >
            <MetaTagLocation v-if="location" :location="location" />
            <MetaTagVideo
              v-else-if="onlineLocation"
              :link="onlineLocation"
              label="i18n.components.card_search_result.view_video"
            />
            <MetaTagDate :date="date" />
          </div>
        </div>
        <div class="flex flex-col space-y-3 md:flex-row md:space-y-0">
          <div
            v-if="!aboveMediumBP"
            class="flex items-center justify-center space-x-4"
          >
            <MetaTagLocation v-if="location" :location="location" />
            <MetaTagVideo
              v-if="onlineLocation"
              :link="onlineLocation"
              label="i18n.components.card_search_result.view_video"
            />
            <MetaTagDate :date="date" />
          </div>
          <div
            class="flex justify-center space-x-3 md:justify-start lg:space-x-4"
          >
            <MetaTagOrganization
              v-if="!isReduced && event.orgs"
              class="pt-2"
              :organization="event.orgs"
            />
          </div>
        </div>
        <p
          class="justify-center md:justify-start md:px-0 md:py-0"
          :class="{
            'line-clamp-3': isReduced,
            'line-clamp-4 lg:line-clamp-5': !isReduced,
          }"
        >
          {{ event.texts?.description || '' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/events/event";
import { useLinkURL } from "~/composables/useLinkURL";

const props = defineProps<{
  event: Event;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();

const aboveMediumBP = useBreakpoint("md");
const i18n = useI18n();
const localePath = useLocalePath();
const { linkUrl } = useLinkURL(props);

const ariaLabel = computed(() =>
  i18n.t("i18n.components.card_search_result.navigate_to_event_aria_label")
);

const date = computed(() => {
  if (props.event.startTime) {
    return props.event.startTime.split("T")[0];
  }
  return "";
});

const eventType = computed<"action" | "learn">(() => props.event.type);

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

const onlineLocation = computed(() => props.event.onlineLocationLink || "");
</script>
