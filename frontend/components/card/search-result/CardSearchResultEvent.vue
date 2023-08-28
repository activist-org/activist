<template>
  <div
    class="border w-fit h-[100%] border-light-section-div dark:border-dark-section-div rounded-lg bg-light-content dark:bg-dark-content"
  >
    <img
      v-if="event.imageURL"
      class="w-[200px] h-[200px]"
      :src="event.imageURL"
      :alt="'The event logo of ' + event.name"
    />
    <div v-else class="w-[200px] h-[200px] flex justify-center items-center">
      <ImageEvent :eventType="event.type" :imgURL="event?.imageURL" />
    </div>
  </div>
  <div class="px-6 pb-1 space-y-4 md:grow">
    <div class="flex flex-col justify-between md:flex-row">
      <div class="flex items-center space-x-4">
        <h2 class="font-bold responsive-h3">
          {{ event.name }}
        </h2>
        <div class="text-light-cta-orange dark:text-dark-cta-orange">
          <Icon name="ph:dots-three-circle-vertical" size="2em" />
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1" v-if="event?.inPersonLocation">
          <Icon name="ic:sharp-location-on" class="mr-1" size="1.25em" />
          {{ event?.inPersonLocation }}
        </div>
        <div class="flex items-center gap-1" v-if="event?.onlineLocation">
          <Icon
            v-if="event?.onlineLocation"
            name="bi:camera-video"
            class="mr-1"
            size="1.25em"
          />
          {{ event?.onlineLocation }}
        </div>
        <div class="flex items-center gap-1">
          <Icon name="bi:calendar-event" class="mr-1" />
          {{ event?.date.toLocaleDateString() }}
        </div>
      </div>
    </div>
    <TopicMarker :topic="event.topic" />
    <div class="flex gap-4" v-if="event">
      <div class="flex items-center gap-1 fill-light-text dark:fill-dark-text">
        <Icon name="IconOrganization" class="mr-1" />
        {{ event.organizer }}
      </div>
      <div class="flex items-center gap-1">
        <Icon name="bi:person-fill-check" class="mr-1" />
        {{ event.supporters }}
        {{ $t("components.card-search-result-event.attending") }}
      </div>
    </div>
    <div>
      {{ event.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~~/types/event";

defineProps<{
  isPrivate?: boolean;
  event: Event;
}>();
</script>
