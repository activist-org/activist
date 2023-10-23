<template>
  <div class="flex w-full justify-center card-style md:justify-start">
    <div className="p-4">
      <div class="flex items-center mb-2">
        <!-- Image Logic Not Yet Implemented, For Now Placeholder is a gray circle for ligh theme, white circle for dark: theme-->
        <div class="w-10 h-10 rounded-full dark:bg-white-300 bg-gray-300"></div>
        <h1 class="font-bold responsive-h3 pl-2">{{ entry.author }}</h1>
        <p class="text-sm pl-2">{{ entry.date.toLocaleString() }}</p>
      </div>
      <p class="text-lg">{{ entry.content }}</p>
      <!--Button with counter for votes and icon arrow up-->
      <BtnLabeled
        class="block"
        :cta="true"
        fontSize="sm"
        leftIcon="bi:arrow-up"
        :counter="entry.votes"
        ariaLabel="components.btn-labeled.vote"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardDiscussionText } from "../../../types/card-discussion-text";

defineProps<{
  isPrivate?: boolean;
  entry: CardDiscussionText;
}>();
</script>
