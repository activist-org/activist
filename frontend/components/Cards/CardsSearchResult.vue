<template>
  <div
    class="flex flex-col items-center w-full h-min card-style sm:items-start"
  >
    <div class="px-1 py-1 sm:px-2 sm:py-2 flex">
      <img
        v-if="organization.imageURL"
        class="search-result-image"
        :src="organization.imageURL"
        alt="This is the alt text, please translate"
      />
      <div
        v-else
        class="flex w-full justify-center items-center text-light-text dark:text-dark-text"
      >
        <Icon name="bi:people" class="w-[75%] h-[75%]" />
      </div>
      <div class="py-5 px-8 font-semibold">
        <h2 class="font-bold responsive-text-2 mb-5">
          {{ organization.name }}
        </h2>
        <TopicMarker class="mb-5" :topic="organization.topic"></TopicMarker>
        <div class="flex gap-4 mb-4 responsive-text-1" v-if="organization">
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
        <div class="responsive-text-1">
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

<style scoped>
.search-result-image {
  height: 250px;
  width: 250px;
}
</style>
