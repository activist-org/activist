<template>
  <div class="relative flex flex-col w-full md:flex-row">
    <div class="flex justify-center w-full md:w-fit">
      <div
        class="border rounded-md border-light-section-div dark:border-dark-section-div h-min"
      >
        <img
          v-if="event.imageURL"
          :class="{
            'w-[150px] h-[150px]': reduced,
            'w-[200px] h-[200px]': !reduced,
          }"
          :src="event.imageURL"
          :alt="
            $t('components.card-search-result-event.img-alt-text') +
            ' ' +
            resource.name
          "
        />
        <div
          v-else
          :class="{
            'w-[150px] h-[150px]': reduced,
            'w-[200px] h-[200px]': !reduced,
          }"
          class="flex items-center justify-center"
        >
          <ImageEvent :eventType="event.type" :imgURL="event?.imageURL" />
        </div>
      </div>
    </div>
    <div
      class="flex-col pt-3 md:pl-4 lg:pl-6 md:grow md:pt-0"
      :class="{
        'space-y-2': reduced,
        'space-y-3 md:space-y-4': !reduced,
      }"
    >
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex items-center justify-center space-x-2 md:space-x-4">
          <h2 class="font-bold responsive-h3">
            {{ event.name }}
          </h2>
          <MenuSearchResult
            class="max-md:absolute max-md:top-0 max-md:right-0"
            searchResultType="event"
          />
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
        <ShieldTopic v-if="!reduced" :topic="event.topic" />
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
  reduced?: boolean;
}>();
</script>
