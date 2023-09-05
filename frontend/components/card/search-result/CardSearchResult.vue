<template>
  <div class="flex justify-center card-style md:justify-start">
    <div
      v-if="searchResultType === 'organization'"
      class="flex flex-col px-3 py-4 md:flex-row md:grow lg:px-5 md:py-3"
    >
      <CardSearchResultOrganization
        :organization="organization"
        :isPrivate="isPrivate"
      />
    </div>
    <div
      v-if="searchResultType === 'event'"
      class="flex flex-col px-3 py-4 md:flex-row md:grow lg:px-5 md:py-3"
    >
      <CardSearchResultEvent
        :event="event"
        :isPrivate="isPrivate"
      />
    </div>
    <div
      v-if="searchResultType === 'resource'"
      class="flex flex-col px-3 py-4 md:flex-row md:grow lg:px-5 md:py-3"
    >
      <CardSearchResultResource
        :resource="resource"
        :isPrivate="isPrivate"
      />
    </div>
    <div
      v-if="searchResultType === 'user'"
      class="flex flex-col px-3 py-4 md:flex-row md:grow lg:px-5 md:py-3"
    >
      <CardSearchResultUser
        :user="user"
        :isPrivate="isPrivate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "../../../types/event";
import type { Organization } from "../../../types/organization";
import type { Resource } from "../../../types/resource";
import type { User } from "../../../types/user";

defineProps<{
  searchResultType: "organization" | "event" | "resource" | "user";
  isPrivate?: boolean;
  organization?: Organization;
  event?: Event;
  resource?: Resource;
  user?: User;
}>();
</script>
