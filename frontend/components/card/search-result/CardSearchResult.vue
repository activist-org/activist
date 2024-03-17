<template>
  <div
    class="flex flex-col justify-center px-3 py-4 card-style md:justify-start md:flex-row md:grow lg:px-5 md:py-3"
  >
    <CardSearchResultOrganization
      v-if="searchResultType === 'organization' && organization"
      :organization="organization"
      :reduced="reduced"
    />
    <CardSearchResultEvent
      v-else-if="searchResultType === 'event' && event"
      :event="event"
      :reduced="reduced"
    />
    <CardSearchResultResource
      v-else-if="searchResultType === 'resource' && resource"
      :resource="resource"
      :isPrivate="isPrivate"
      :reduced="reduced"
    />
    <CardSearchResultUser
      v-else-if="searchResultType === 'user' && user"
      :user="user"
      :isPrivate="isPrivate"
      :reduced="reduced"
    />
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/event";
import type { Organization } from "~/types/organization";
import type { Resource } from "~/types/resource";
import type { User } from "~/types/user";

defineProps<{
  searchResultType: "organization" | "event" | "resource" | "user";
  reduced?: boolean;
  isPrivate?: boolean;
  organization?: Organization;
  event?: Event;
  resource?: Resource;
  user?: User;
}>();
</script>
