<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style px-5 py-5">
    <div class="flex flex-col gap-3">
      <h3 class="text-left font-display" for="feedback">
        {{ header }}
      </h3>
      <p v-if="description">
        {{ description }}
      </p>
      <div v-if="multiline">
        <!-- MARK: Mobile -->
        <textarea
          id="feedback"
          v-if="!aboveMediumBP"
          :aria-label="textAreaAriaLabel"
          class="block w-full resize-none overflow-y-scroll rounded-md border border-white bg-transparent px-3 py-2 dark:border-white md:resize-y md:overflow-hidden"
          :placeholder="placeholder"
          rows="5"
          type="text"
        ></textarea>
        <!-- MARK: Desktop -->
        <textarea
          id="feedback"
          v-if="aboveMediumBP"
          :aria-label="textAreaAriaLabel"
          class="block w-full resize-none overflow-y-scroll rounded-md border border-white bg-transparent px-3 py-2 dark:border-white md:resize-y md:overflow-hidden"
          :placeholder="placeholder"
          rows="3"
          type="text"
        ></textarea>
      </div>
      <input
        id="feedback"
        v-else
        :aria-label="textAreaAriaLabel"
        class="resize-none overflow-y-scroll rounded-md border border-white bg-transparent px-3 py-2 dark:border-white md:resize-y md:overflow-hidden"
        :placeholder="placeholder"
        type="text"
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
