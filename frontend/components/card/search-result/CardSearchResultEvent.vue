<template>
  <div class="flex flex-col w-full md:flex-row">
    <div
      class="flex justify-center w-full md:w-fit rounded-md border border-light-section-div dark:border-dark-section-div"
    >
      <img
        v-if="event.imageURL"
        class="w-[200px] h-[200px]"
        :src="event.imageURL"
        :alt="
          $t('components.card-search-result-event.img-alt-text') +
          ' ' +
          resource.name
        "
      />
      <div v-else class="w-[200px] h-[200px] flex justify-center items-center">
        <ImageEvent :eventType="event.type" :imgURL="event?.imageURL" />
      </div>
    </div>
    <div
      class="flex-col pt-3 space-y-3 md:pl-4 lg:pl-6 md:space-y-4 md:grow md:pt-0"
    >
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex items-center justify-center space-x-2 md:space-x-4">
          <h2 class="font-bold responsive-h3">
            {{ event.name }}
          </h2>
          <MenuSearchResult searchResultType="event" />
        </div>
        <div class="items-center hidden space-x-3 md:flex lg:space-x-5">
          <MetaTagLocation
            v-if="event?.inPersonLocation"
            :location="event?.inPersonLocation"
          />
          <MetaTagVideo
            v-if="event?.onlineLocation"
            :link="event?.onlineLocation"
            label="components.meta-tag-video.view-video"
          />
          <MetaTagDate :date="event?.date.toLocaleDateString()" />
        </div>
      </div>
      <div class="flex justify-center md:justify-start">
        <ShieldTopic :topic="event.topic" />
      </div>
      <div class="flex flex-col space-y-3 md:flex-row md:space-y-0">
        <div class="flex items-center justify-center space-x-4 md:hidden">
          <MetaTagLocation
            v-if="event?.inPersonLocation"
            :location="event?.inPersonLocation"
          />
          <MetaTagVideo
            v-if="event?.onlineLocation"
            :link="event?.onlineLocation"
            label="components.meta-tag-video.view-video"
          />
          <MetaTagDate :date="event?.date.toLocaleDateString()" />
        </div>
        <div
          class="flex justify-center space-x-3 lg:space-x-4 md:justify-start"
        >
          <MetaTagOrganization :organizations="event.organizations" />
          <MetaTagSupporters
            :supporters="event.supporters"
            label="components.meta-tag.supporters_lower"
          />
        </div>
      </div>
      <div class="flex justify-center md:justify-start">
        {{ event.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/event";

defineProps<{
  event: Event;
}>();
</script>
