<template>
  <div class="space-y-6">
    <DiscussionHeader />
    <CardDiscussionText
      v-for="discussionText in discussionTexts"
      :key="discussionText"
      :isPrivate="false"
      :discussionText="discussionText"
    />
    <CardDiscussionInput
      v-if="organization && organization.status == 'pending'"
      :discussionInput="discussionInput"
    />
  </div>
</template>

<script setup lang="ts">
import type { DiscussionInput } from "~/types/card-discussion-input";
import type { DiscussionText } from "~/types/card-discussion-text";
import type { Organization } from "~/types/organization";

defineProps<{
  discussionInput: DiscussionInput;
  discussionTexts: DiscussionText[];
  organization?: Organization;
}>();
</script>
