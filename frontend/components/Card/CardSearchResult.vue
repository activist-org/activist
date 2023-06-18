<template>
  <div class="flex items-center w-full h-min card-style sm:items-start">
    <div
      v-if="searchResultType === 'organization'"
      class="flex items-center p-2 sm:px-5 sm:py-3"
    >
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
          class="w-[200px] h-[200px] flex justify-center items-center text-light-text dark:text-dark-text"
        >
          <Icon name="bi:people" color="black" class="w-[75%] h-[75%]" />
        </div>
      </div>
      <div class="px-6 pb-1 space-y-4">
        <div class="flex space-x-4 items-center">
          <h2 class="font-bold responsive-h3">
            {{ organization.name }}
          </h2>
          <div class="text-light-cta-orange dark:text-dark-cta-orange">
            <Icon name="ph:dots-three-circle-vertical" size="2em" />
          </div>
        </div>
        <TopicMarker :topic="organization.topic" />
        <div class="flex gap-4" v-if="organization">
          <div class="flex gap-1 items-center">
            <Icon name="ic:sharp-location-on" class="mr-1" size="1.25em" />
            {{ organization.location }}
          </div>
          <div class="flex gap-1 items-center">
            <Icon name="bi:people" class="mr-1" />
            {{ organization.members }} {{ $t("members") }}
          </div>
          <div
            class="flex gap-1 items-center fill-light-text dark:fill-dark-text"
          >
            <Icon name="IconSupport" class="mr-1" />
            {{ organization.supporters }} {{ $t("supporters") }}
          </div>
        </div>
        <div>
          {{ organization.description }}
        </div>
      </div>
    </div>
    <div
      v-if="searchResultType === 'event'"
      class="flex items-center p-2 grow sm:px-5 sm:py-3"
    >
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
          class="w-[200px] h-[200px] flex justify-center items-center"
        >
          <ImageEvent :eventType="event.type" :imgURL="event?.imageURL" />
        </div>
      </div>
      <div class="px-6 pb-1 space-y-4 grow">
        <div class="flex justify-between">
          <div class="flex space-x-4 items-center">
            <h2 class="font-bold responsive-h3">
              {{ event.name }}
            </h2>
            <div class="text-light-cta-orange dark:text-dark-cta-orange">
              <Icon name="ph:dots-three-circle-vertical" size="2em" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex gap-1 items-center" v-if="event?.inPersonLocation">
              <Icon name="ic:sharp-location-on" class="mr-1" size="1.25em" />
              {{ event?.inPersonLocation }}
            </div>
            <div class="flex gap-1 items-center" v-if="event?.onlineLocation">
              <Icon
                v-if="event?.onlineLocation"
                name="bi:camera-video"
                class="mr-1"
                size="1.25em"
              />
              {{ event?.onlineLocation }}
            </div>
            <div class="flex gap-1 items-center">
              <Icon name="bi:calendar-event" class="mr-1" />
              {{ event?.date.toLocaleDateString() }}
            </div>
          </div>
        </div>
        <TopicMarker :topic="event.topic" />
        <div class="flex gap-4" v-if="event">
          <div
            class="flex gap-1 items-center fill-light-text dark:fill-dark-text"
          >
            <Icon name="IconOrganization" class="mr-1" />
            {{ event.organizer }}
          </div>
          <div class="flex gap-1 items-center">
            <Icon name="bi:person-fill-check" class="mr-1" />
            {{ event.supporters }} {{ $t("attending") }}
          </div>
        </div>
        <div>
          {{ event.description }}
        </div>
      </div>
    </div>
    <div
      v-if="searchResultType === 'resource'"
      class="flex items-center p-2 grow sm:px-5 sm:py-3"
    >
      <div
        class="border h-[90%] border-light-section-div dark:border-dark-section-div rounded-lg bg-light-content dark:bg-dark-content"
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
      <div class="px-6 pb-1 space-y-4 grow">
        <div class="flex justify-between">
          <div class="flex space-x-4 items-center">
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
          <div
            class="flex gap-1 items-center fill-light-text dark:fill-dark-text"
          >
            <Icon name="IconOrganization" class="mr-1" />
            {{ resource.organizer }}
          </div>
          <div class="flex gap-1 items-center">
            <Icon name="bi:star" class="mr-1" />
            {{ resource.stars }}
          </div>
          <div class="flex gap-1 items-center" v-if="resource.relatedLocation">
            <Icon name="ic:sharp-location-on" class="mr-1" size="1.25em" />
            {{ resource.relatedLocation }}
          </div>
          <div class="flex gap-1 items-center">
            <Icon name="bi:calendar-event" class="mr-1" />
            {{ resource.creationDate.toLocaleDateString() }}
          </div>
        </div>
        <div>
          {{ resource.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~~/types/event";
import type { Organization } from "~~/types/organization";
import type { Resource } from "~~/types/resource";

const props = defineProps<{
  searchResultType: "organization" | "event" | "resource";
  isPrivate?: boolean;
  organization?: Organization;
  event?: Event;
  resource?: Resource;
}>();
</script>
