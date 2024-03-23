<template>
  <div
    class="card-style flex flex-col justify-center px-3 py-4 md:grow md:flex-row md:justify-start md:py-3 lg:px-5"
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
