<template>
  <div class="px-6 py-5 card-style">
    <div class="flex flex-col gap-3">
      <label for="feedback">
        <h3 class="text-left responsive-h3 font-display">{{ header }}</h3>
      </label>
      <p v-if="description">{{ description }}</p>
      <div v-if="multiline">
        <!-- Mobile -->
        <textarea
          id="feedback"
          aria-label="organization-feedback"
          type="text"
          :placeholder="placeholder"
          class="block w-full px-3 py-2 overflow-y-scroll bg-transparent border border-white resize-none rounded-md md:hidden dark:border-white md:resize-y md:overflow-hidden"
          rows="5"
        ></textarea>
        <!-- Desktop -->
        <textarea
          id="feedback"
          aria-label="organization-feedback"
          type="text"
          :placeholder="placeholder"
          class="hidden w-full px-3 py-2 overflow-y-scroll bg-transparent border border-white resize-none rounded-md md:block dark:border-white md:resize-y md:overflow-hidden"
          rows="3"
        ></textarea>
      </div>
      <input
        v-else
        id="feedback"
        type="text"
        aria-label="organization-feedback"
        :placeholder="placeholder"
        class="px-3 py-2 overflow-y-scroll bg-transparent border border-white resize-none rounded-md dark:border-white md:resize-y md:overflow-hidden"
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
}>();
</script>
