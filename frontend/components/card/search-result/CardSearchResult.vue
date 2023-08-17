<template>
  <div class="flex justify-center h-min card-style md:justify-start">
    <div
      v-if="searchResultType === 'organization'"
      class="flex flex-col p-2 md:flex-row sm:px-5 sm:py-3 h-fit"
    >
      <CardSearchResultOrganization
        :organization="organization"
        :isPrivate="isPrivate"
      />
    </div>
    <div
      v-if="searchResultType === 'event'"
      class="flex flex-col p-2 md:flex-row md:grow sm:px-5 sm:py-3 h-fit"
    >
      <CardSearchResultEvent :event="event" :isPrivate="isPrivate" />
    </div>
    <div
      v-if="searchResultType === 'resource'"
      class="flex flex-col p-2 md:flex-row sm:px-5 sm:py-3 h-fit"
    >
      <CardSearchResultResource :resource="resource" :isPrivate="isPrivate" />
    </div>
    <div
      v-if="searchResultType === 'user'"
      class="flex flex-col p-2 md:flex-row sm:px-5 sm:py-3 h-fit"
    >
      <CardSearchResultUser :user="user" :isPrivate="isPrivate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~~/types/event";
import type { Organization } from "~~/types/organization";
import type { Resource } from "~~/types/resource";
import type { User } from "~~/types/user";

const props = defineProps<{
  searchResultType: "organization" | "event" | "resource" | "user";
  isPrivate?: boolean;
  organization?: Organization;
  event?: Event;
  resource?: Resource;
  user?: User;
}>();
</script>
