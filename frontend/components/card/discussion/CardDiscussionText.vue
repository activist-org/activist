<template>
  <div
    class="flex flex-col space-y-2 px-3 py-4 md:grow lg:px-5 md:py-3 w-full justify-center card-style md:justify-start"
  >
    <div class="flex space-x-1 items-center">
      <!-- Image Logic Not Yet Implemented. For now placeholder image is a circle colored using placeholder colors.-->
      <div
        class="w-8 h-8 rounded-full dark:bg-dark-placeholder bg-light-placeholder"
      ></div>
      <div class="flex space-x-1 items-baseline">
        <h1 class="font-bold responsive-h5 pl-2">
          {{ discussionText.author }}
        </h1>
        <p>{{ $t("components.card-discussion-text.on") }}</p>
        <p>
          {{ discussionText.date.toLocaleDateString() }}
        </p>
      </div>
    </div>
    <p class="text-lg">{{ discussionText.content }}</p>
    <BtnLabeled
      class="block"
      :cta="true"
      fontSize="sm"
      leftIcon="bi:arrow-up"
      iconSize="1.25em"
      :counter="discussionText.votes"
      ariaLabel="components.btn-labeled.vote"
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
