<template>
  <div
    class="flex items-center w-full h-min card-style sm:items-start"
  >
    <div v-if="searchResultType === 'organization'" class="p-2 sm:px-5 sm:py-3 flex items-center">
      <div
        class="border h-[90%] border-light-section-div dark:border-dark-section-div rounded-lg bg-light-content"
      >
        <img
          v-if="organization.imageURL"
          class="w-[200px] h-[200px]"
          :src="organization.imageURL"
          :alt="'The organization logo of ' + organization.name"
        />
        <div
          v-else
          class="w-[200px] h-[200px] flex w-full justify-center items-center text-light-text dark:text-dark-text"
        >
          <Icon name="bi:people" color="black" class="w-[75%] h-[75%]" />
        </div>
      </div>
      <div class="pb-1 px-6 space-y-4">
        <h2 class="font-bold responsive-h3">
          {{ organization.name }}
        </h2>
        <TopicMarker :topic="organization.topic"></TopicMarker>
        <div class="flex gap-4" v-if="organization">
          <div>
            <Icon name="bi:map" class="mr-1" />
            {{ organization.location }}
          </div>
          <div>
            <Icon name="bi:people" class="mr-1" />
            {{ organization.members }} {{ $t("members") }}
          </div>
          <div>
            <Icon name="bi:balloon-heart" class="mr-1" />
            {{ organization.supporters }} {{ $t("supporters") }}
          </div>
        </div>
        <div>
          {{ organization.description }}
        </div>
      </div>
    </div>
    <div v-if="searchResultType === 'event'" class="grow p-2 sm:px-5 sm:py-3 flex items-center">
      <div
        class="border h-[90%] border-light-section-div dark:border-dark-section-div rounded-lg bg-light-content"
      >
        <img
          v-if="event.imageURL"
          class="w-[200px] h-[200px]"
          :src="event.imageURL"
          :alt="'The event logo of ' + event.name"
        />
        <div
          v-else
          class="w-[200px] h-[200px] flex w-full justify-center items-center text-light-text dark:text-dark-text"
        >
          <Icon name="bi:calendar" color="black" class="w-[75%] h-[75%]" />
        </div>
      </div>
      <div class="grow pb-1 px-6 space-y-4">
        <div class="flex justify-between">
          <h2 class="font-bold responsive-h3">
            {{ event.name }}
          </h2>
          <div class="flex gap-4 items-center">
            <div v-if="event?.inPersonLocation">
              <Icon name="bi:pin-map" class="mr-1" />
              {{ event?.inPersonLocation }}
            </div>
            <div v-if="event?.onlineLocation">
              <Icon v-if="event?.onlineLocation" name="bi:pc-display-horizontal" class="mr-1"/>
              {{ event?.onlineLocation }}
            </div>
            <div>
              <Icon name="bi:calendar2-plus" class="mr-1" />
              {{ event?.date.toLocaleDateString() }}
            </div>
          </div>
        </div>
        <TopicMarker :topic="event.topic"></TopicMarker>
        <div class="flex gap-4" v-if="event">
          <div>
            <Icon name="bi:people" class="mr-1" />
            {{ event.organizer }}
          </div>
          <div>
            <Icon name="bi:person-fill-check" class="mr-1" />
            {{ event.supporters }} {{ $t("attending") }}
          </div>
        </div>
        <div>
          {{ event.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "../../types/organization";
import type { Event } from "../../types/event"

const props = defineProps<{
  searchResultType: "organization" | "event" | "resource";
  isPrivate?: boolean;
  organization?: Organization;
  event?: Event;
}>();

</script>
