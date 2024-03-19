<template>
  <div class="px-5 py-5 card-style">
    <div class="flex flex-col gap-3">
      <label for="feedback" class="text-left responsive-h3 font-display">
        {{ header }}
      </label>
      <p v-if="description">
        {{ description }}
      </p>
      <div v-if="multiline">
        <!-- Mobile -->
        <textarea
          id="feedback"
          class="block w-full px-3 py-2 overflow-y-scroll bg-transparent border border-white resize-none rounded-md md:hidden dark:border-white md:resize-y md:overflow-hidden"
          type="text"
          rows="5"
          :placeholder="placeholder"
          :aria-label="textAreaAriaLabel"
        ></textarea>
        <!-- Desktop -->
        <textarea
          id="feedback"
          class="hidden w-full px-3 py-2 overflow-y-scroll bg-transparent border border-white resize-none rounded-md md:block dark:border-white md:resize-y md:overflow-hidden"
          type="text"
          rows="3"
          :placeholder="placeholder"
          :aria-label="textAreaAriaLabel"
        ></textarea>
      </div>
      <input
        v-else
        id="feedback"
        class="px-3 py-2 overflow-y-scroll bg-transparent border border-white resize-none rounded-md dark:border-white md:resize-y md:overflow-hidden"
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
