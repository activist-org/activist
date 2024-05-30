<template>
  <div class="card-style px-5 py-5">
    <div class="flex flex-col gap-3">
      <label for="feedback" class="responsive-h3 text-left font-display">
        {{ header }}
      </label>
      <p v-if="description">
        {{ description }}
      </p>
      <div v-if="multiline">
        <!-- Mobile -->
        <textarea
          v-if="!medium"
          id="feedback"
          class="block w-full resize-none overflow-y-scroll rounded-md border border-white bg-transparent px-3 py-2 dark:border-white md:resize-y md:overflow-hidden"
          type="text"
          rows="5"
          :placeholder="placeholder"
          :aria-label="textAreaAriaLabel"
        ></textarea>
        <!-- Desktop -->
        <textarea
          v-if="medium"
          id="feedback"
          class="block w-full resize-none overflow-y-scroll rounded-md border border-white bg-transparent px-3 py-2 dark:border-white md:resize-y md:overflow-hidden"
          type="text"
          rows="3"
          :placeholder="placeholder"
          :aria-label="textAreaAriaLabel"
        ></textarea>
      </div>
      <input
        v-else
        id="feedback"
        class="resize-none overflow-y-scroll rounded-md border border-white bg-transparent px-3 py-2 dark:border-white md:resize-y md:overflow-hidden"
        type="text"
        :placeholder="placeholder"
        :aria-label="textAreaAriaLabel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import useBreakpoint from "~/composables/useBreakpoint";
const medium = useBreakpoint("md");

defineProps<{
  header: string;
  description: string;
  placeholder: string;
  multiline: boolean;
  textAreaAriaLabel: string;
}>();
</script>
