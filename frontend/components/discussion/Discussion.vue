<template>
  <div class="space-y-6">
    <DiscussionHeader />
    <div v-if="discussionEntries" class="space-y-6">
      <CardDiscussionEntry
        v-for="discussionEntry in discussionEntries"
        :key="discussionEntry.id"
        :isPrivate="false"
        :discussionEntry="discussionEntry"
      />
    </div>
    <CardDiscussionInput
      v-if="organizations && discussionInput"
      :discussionInput="discussionInput"
    />
  </div>
</template>

<script setup lang="ts">
import type { DiscussionEntry } from "~/types/card-discussion-entry";
import type { DiscussionInput } from "~/types/card-discussion-input";
import type { Organization } from "~/types/organization";

defineProps<{
  discussionInput?: DiscussionInput;
  discussionEntries?: DiscussionEntry[];
  organizations?: Organization[];
}>();
</script>
