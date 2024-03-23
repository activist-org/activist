<template>
  <div
    class="card-style flex w-full flex-col justify-center space-y-2 px-3 py-4 md:grow md:justify-start md:py-3 lg:px-5"
  >
    <div class="flex items-center space-x-1">
      <!-- Image Logic Not Yet Implemented. For now placeholder image is a circle colored using placeholder colors.-->
      <div
        class="dark:bg-dark-placeholder bg-light-placeholder h-8 w-8 rounded-full"
      ></div>
      <div class="flex items-baseline space-x-1">
        <h1 class="responsive-h5 pl-2 font-bold">
          {{ discussionText.author }}
        </h1>
        <p>{{ $t("components.card-discussion-text.on") }}</p>
        <p>
          {{ discussionText.date.toLocaleDateString() }}
        </p>
      </div>
    </div>
    <p class="text-lg">{{ discussionText.content }}</p>
    <BtnAction
      class="block"
      :cta="true"
      fontSize="sm"
      leftIcon="bi:arrow-up"
      iconSize="1.25em"
      :counter="discussionText.votes"
      ariaLabel="components.btn-action.upvote-discussion-aria-label"
    />
  </div>
</template>

<script setup lang="ts">
import type { DiscussionText } from "~/types/card-discussion-text";

defineProps<{
  isPrivate?: boolean;
  discussionText: DiscussionText;
}>();
</script>
