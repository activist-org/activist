<template>
  <div class="relative flex w-full flex-col md:flex-row">
    <div class="flex w-full justify-center md:w-fit">
      <div
        class="h-min rounded-md border border-light-section-div dark:border-dark-section-div"
      >
        <img
          v-if="event.imageURL"
          :class="{
            'h-[150px] w-[150px]': reduced,
            'h-[200px] w-[200px]': !reduced,
          }"
          :src="event.imageURL"
          :alt="
            $t('components.card-search-result-event.img-alt-text') +
            ' ' +
            event.name
          "
        />
        <div
          v-else
          :class="{
            'h-[150px] w-[150px]': reduced,
            'h-[200px] w-[200px]': !reduced,
          }"
          class="flex items-center justify-center"
        >
          <ImageEvent
            :eventType="event.type"
            :imgURL="event?.imageURL"
            :alt="
              $t('components._global.entity-logo', {
                entity_name: event.name,
              })
            "
          />
        </div>
      </div>
    </div>
    <div
      class="flex-col pt-3 md:grow md:pl-4 md:pt-0 lg:pl-6"
      :class="{
        'space-y-2': reduced,
        'space-y-3 md:space-y-4': !reduced,
      }"
    >
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex items-center justify-center space-x-2 md:space-x-4">
          <h2 class="responsive-h3 font-bold">
            {{ event.name }}
          </h2>
          <MenuSearchResult
            class="max-md:absolute max-md:right-0 max-md:top-0"
            :event="event"
          />
        </div>
        <div class="hidden items-center space-x-3 md:flex lg:space-x-5">
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
          class="flex justify-center space-x-3 md:justify-start lg:space-x-4"
        >
          <MetaTagOrganization :organizations="event.organizations" />
          <MetaTagSupporters
            :supporters="event.supporters"
            label="components.meta-tag.supporters_lower"
          />
        </div>
      </div>
      <div class="flex justify-center md:justify-start">
        <ShieldTopic v-if="!reduced" :topic="event.topic" />
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
