<template>
  <div
    class="flex flex-col items-center w-full h-min card-style sm:items-start"
  >
    <div class="p-2 sm:px-5 sm:py-3 flex items-center">
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
          class="flex w-full justify-center items-center text-light-text dark:text-dark-text"
        >
          <Icon name="bi:people" class="w-[75%] h-[75%]" />
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
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "../../types/organization";

defineProps<{
  searchResultType: "organization" | "event" | "resource";
  isPrivate?: boolean;
  organization: Organization;
}>();
</script>
