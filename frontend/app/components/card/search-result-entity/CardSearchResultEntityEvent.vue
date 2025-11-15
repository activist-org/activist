<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardSearchResultEntity
    :ariaLabel="ariaLabel"
    data-testid="event-card"
    :description="description"
    :entityName="entityName"
    :imageAlt="imageAlt"
    :imageUrl="imageUrl"
    :isExternalLink="false"
    :isReduced="isReduced"
    :linkUrl="linkUrl"
    :title="event.name"
  >
    <template #image="{ imageUrl: slotImageUrl }">
      <div
        class="flex items-center justify-center"
        :class="{
          'h-[150px] w-[150px]': isReduced,
          'h-[200px] w-[200px]': !isReduced,
        }"
      >
        <ImageEvent
          :alt="imageAlt"
          :eventType="eventType"
          :imgUrl="slotImageUrl"
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
        label="i18n.components.card_search_result_entity_event.view_video"
        :link="onlineLocation"
      />
      <MetaTagDate v-if="event.id != ''" :date="date" />
    </template>
    <template #mobile-meta-tags>
      <MetaTagLocation v-if="location" :location="location" />
      <MetaTagVideo
        v-if="onlineLocation"
        label="i18n.components.card_search_result_entity_event.view_video"
        :link="onlineLocation"
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
  </CardSearchResultEntity>
</template>

<script setup lang="ts">

const props = defineProps<{
  event: Activity;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();

const { t } = useI18n();
const { linkUrl } = useLinkURL(props);

const description = computed(() => {
  return props.event.texts[0]?.description || "";
});

const ariaLabel = computed(() => {
  return t(
    "i18n.components.card_search_result_entity_event.navigate_to_event_aria_label"
  );
});

const imageAlt = computed(() => {
  return t(
    "i18n.components.card_search_result_entity_event.event_img_alt_text",
    {
      entity_name: props.event.name,
    }
  );
});
const { BASE_BACKEND_URL_NO_V1 } = useGetBaseURLs();
const imageUrl = computed(() => {
  if (props.event?.iconUrl?.fileObject) {
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

const date: ComputedRef<string> = computed((): string => {
  if (props.event.startTime) {
    return props.event.startTime.split("T")[0] ?? ""!;
  }
  return "";
});

const entityName = computed(() => {
  // Events don't have entity names like organizations (@org_name).
  return "";
});

const eventType = computed<"action" | "learn">(() => {
  return props.event.type;
});
</script>
