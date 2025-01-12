<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
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
        <!-- MARK: Mobile -->
        <textarea
          v-if="!aboveMediumBP"
          id="feedback"
          class="block w-full resize-none overflow-y-scroll rounded-md border border-white bg-transparent px-3 py-2 dark:border-white md:resize-y md:overflow-hidden"
          type="text"
          rows="5"
          :placeholder="placeholder"
          :aria-label="textAreaAriaLabel"
        ></textarea>
        <!-- MARK: Desktop -->
        <textarea
          v-if="aboveMediumBP"
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
defineProps<{
  header: string;
  description: string;
  placeholder: string;
  multiline: boolean;
  textAreaAriaLabel: string;
}>();

const aboveMediumBP = useBreakpoint("md");
</script>
