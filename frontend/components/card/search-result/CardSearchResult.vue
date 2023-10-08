<template>
  <div class="flex justify-center card-style md:justify-start">
    <div
      v-if="searchResultType === 'organization'"
      class="flex flex-col px-3 py-4 md:flex-row md:grow lg:px-5 md:py-3"
    >
      <cardsearchresultorganization
        :organization="organization"
        :isPrivate="isPrivate"
      />
    </div>
    <div
      v-if="searchResultType === 'event'"
      class="flex flex-col px-3 py-4 md:flex-row md:grow lg:px-5 md:py-3"
    >
      <cardsearchresultevent :event="event" :isPrivate="isPrivate" />
    </div>
    <div
      v-if="searchResultType === 'resource'"
      class="flex flex-col px-3 py-4 md:flex-row md:grow lg:px-5 md:py-3"
    >
      <cardsearchresultresource :resource="resource" :isPrivate="isPrivate" />
    </div>
    <div
      v-if="searchResultType === 'user'"
      class="flex flex-col px-3 py-4 md:flex-row md:grow lg:px-5 md:py-3"
    >
      <cardsearchresultuser :user="user" :isPrivate="isPrivate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { event } from "../../../types/event";
import type { organization } from "../../../types/organization";
import type { resource } from "../../../types/resource";
import type { user } from "../../../types/user";

defineProps<{
  searchResultType: "organization" | "event" | "resource" | "user";
  isPrivate?: boolean;
  organization?: organization;
  event?: event;
  resource?: resource;
  user?: user;
}>();
</script>
