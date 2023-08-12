<template>
  <div class="h-min card-style flex justify-center md:justify-start">
    <div
      v-if="searchResultType === 'organization'"
      class="flex md:flex-row flex-col p-2 sm:px-5 sm:py-3 h-fit"
    >
      <CardSearchResultOrganization
        :organization="organization"
        :isPrivate="isPrivate"
      />
    </div>
    <div
      v-if="searchResultType === 'event'"
      class="flex md:flex-row flex-col md:grow p-2 sm:px-5 sm:py-3 h-fit"
    >
      <CardSearchResultEvent :event="event" :isPrivate="isPrivate" />
    </div>
    <div
      v-if="searchResultType === 'resource'"
      class="flex md:flex-row flex-col p-2 sm:px-5 sm:py-3 h-fit"
    >
      <CardSearchResultResource :resource="resource" :isPrivate="isPrivate" />
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
