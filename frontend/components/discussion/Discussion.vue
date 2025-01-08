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
import type {
  DiscussionEntry,
  DiscussionInput,
} from "~/types/content/discussion";
import type { Organization } from "~/types/communities/organization";

defineProps<{
  discussionEntries?: DiscussionEntry[];
  discussionInput?: DiscussionInput;
  organizations?: Organization[];
}>();
</script>
