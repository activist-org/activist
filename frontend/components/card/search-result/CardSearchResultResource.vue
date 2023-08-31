<template>
  <div
    class="border w-fit h-[100%] border-light-section-div dark:border-dark-section-div rounded-lg bg-light-content dark:bg-dark-content"
  >
    <img
      v-if="resource.imageURL"
      class="w-[200px] h-[200px]"
      :src="resource.imageURL"
      :alt="'The event logo of ' + resource.name"
    />
    <div
      v-else
      class="w-[200px] h-[200px] flex justify-center items-center fill-light-text dark:fill-dark-text"
    >
      <Icon name="IconResource" class="w-[75%] h-[75%]" />
    </div>
  </div>
  <div class="px-6 pb-1 space-y-4 md:grow">
    <div class="flex justify-between">
      <div class="flex items-center space-x-4">
        <h2 class="font-bold responsive-h3">
          {{ resource.name }}
        </h2>
        <div class="text-light-cta-orange dark:text-dark-cta-orange">
          <Icon name="ph:dots-three-circle-vertical" size="2em" />
        </div>
      </div>
    </div>
    <TopicMarker :topic="resource.topic" />
    <div class="flex gap-4" v-if="resource">
      <div class="flex items-center gap-1 fill-light-text dark:fill-dark-text">
        <Icon name="IconOrganization" class="mr-1" />
        {{ resource.organizer }}
      </div>
      <div class="flex items-center gap-1">
        <Icon name="bi:star" class="mr-1" />
        {{ resource.stars }}
      </div>
      <div class="flex items-center gap-1" v-if="resource.relatedLocation">
        <Icon name="ic:sharp-location-on" class="mr-1" size="1.25em" />
        {{ resource.relatedLocation }}
      </div>
      <div class="flex items-center gap-1">
        <Icon name="bi:calendar-event" class="mr-1" />
        {{ resource.creationDate.toLocaleDateString() }}
      </div>
    </div>
    <div>
      {{ resource.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Resource } from "../../../types/resource";

defineProps<{
  isPrivate?: boolean;
  resource: Resource;
}>();
</script>
