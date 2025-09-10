<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div>
    <CardSearchResultOrganization
      v-if="organization"
      :organization="organization"
      :isReduced="isReduced"
      :isPrivate="isPrivate"
    />
    <CardSearchResultGroup
      v-else-if="group"
      :group="group"
      :isReduced="isReduced"
      :isPrivate="isPrivate"
    />
    <CardSearchResultEvent
      v-else-if="event"
      :event="event"
      :isReduced="isReduced"
      :isPrivate="isPrivate"
    />
    <CardSearchResultResource
      v-else-if="resource"
      :resource="resource"
      :isReduced="isReduced"
      :isPrivate="isPrivate"
    />
    <CardSearchResultUser
      v-else-if="user"
      :user="user"
      :isReduced="isReduced"
      :isPrivate="isPrivate"
    />
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/auth/user";
import type { Group } from "~/types/communities/group";
import type { Organization } from "~/types/communities/organization";
import type { Resource } from "~/types/content/resource";
import type { Event } from "~/types/events/event";

defineProps<{
  organization?: Organization;
  group?: Group;
  event?: Event;
  resource?: Resource;
  user?: User;
  isReduced?: boolean;
  isPrivate?: boolean;
}>();
</script>
