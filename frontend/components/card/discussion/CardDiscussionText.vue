<template>
    <div class="flex w-full">
      <div className="p-4">
        <div class="flex items-center mb-2">
          <!-- Image Logic Not Yet Implemented, For Now Placeholder is a gray circle-->
          <div class="w-10 h-10 rounded-full bg-gray-300"></div>
          <h1 class="font-bold responsive-h3 pl-2">{{ entry.author }}</h1>
          <p class="text-sm pl-2">{{ entry.date.toLocaleString() }}</p>
        </div>
        <p>{{ entry.content }}</p>
        <span class="ml-auto text-sm text-gray-500">Upvotes: {{ entry.votes }}</span>
        <BtnLabeled
            class="block"
            :cta="true"
            label="Votes"
            fontSize="sm"
            ariaLabel="components.btn-labeled.get-in-touch-aria-label"
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