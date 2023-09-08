<template>
  <div class="px-5 py-5 card-style">
    <div class="flex flex-col gap-3">
      <label for="feedback">
        <h3 class="text-left responsive-h3 font-display">{{ header }}</h3>
      </label>
      <p v-if="description">{{ description }}</p>
      <div v-if="multiline">
        <!-- Mobile -->
        <textarea
          class="block w-full px-3 py-2 overflow-y-scroll bg-transparent border border-white resize-none rounded-md md:hidden dark:border-white md:resize-y md:overflow-hidden"
          id="feedback"
          type="text"
          :placeholder="placeholder"
          rows="5"
          :aria-label="textAreaAriaLabel"
        ></textarea>
        <!-- Desktop -->
        <textarea
          class="hidden w-full px-3 py-2 overflow-y-scroll bg-transparent border border-white resize-none rounded-md md:block dark:border-white md:resize-y md:overflow-hidden"
          id="feedback"
          type="text"
          :placeholder="placeholder"
          rows="3"
          :aria-label="textAreaAriaLabel"
        ></textarea>
      </div>
      <input
        class="px-3 py-2 overflow-y-scroll bg-transparent border border-white resize-none rounded-md dark:border-white md:resize-y md:overflow-hidden"
        v-else
        id="feedback"
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
</script>
