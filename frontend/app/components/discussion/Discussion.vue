<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="space-y-6">
    <CardDiscussionInput
      v-if="organizations && discussionInput"
      :discussionInput="discussionInput"
    />
  </div>
</template>

<script setup lang="ts">

defineProps<{
  discussionEntries?: DiscussionEntry[];
  discussionInput?: DiscussionInput;
  organizations?: Organization[];
}>();
</script>
