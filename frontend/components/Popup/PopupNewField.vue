<template>
  <div
    class="flex flex-col px-4 pt-2 pb-3 shadow-md space-y-2 card-style bg-light-header dark:bg-dark-header w-fit shadow-zinc-700"
  >
    <div class="relative flex">
      <p class="pl-1 responsive-h5">{{ title }}</p>
      <div
        class="absolute right-0 mr-1 text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text"
      >
        <Icon name="bi:x-circle-fill" class="w-6 h-6" />
      </div>
    </div>
    <input
      ref="input"
      type="text"
      :placeholder="fieldNamePrompt"
      class="h-8 p-1 bg-transparent border rounded-sm w-52 border-light-text dark:border-dark-text focus-brand"
    />
    <textarea
      v-if="descriptionPrompt"
      name="message"
      rows="3"
      cols="10"
      :placeholder="descriptionPrompt"
      class="p-1 bg-transparent border rounded-sm resize-none border-light-text dark:border-dark-text focus-brand min-w-[75%] min-h-[50%]"
    ></textarea>
    <div
      class="flex items-center px-4 py-1 font-semibold text-white break-all cursor-pointer select-none gap-1 rounded-md text-md bg-light-cta-orange hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover dark:active:bg-dark-cta-orange focus-brand w-fit"
    >
      <Icon name="bi:plus" size="1.5em" />
      {{ ctaBtnLabel }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  fieldNamePrompt: string;
  descriptionPrompt?: string;
  ctaBtnLabel: string;
}>();
</script>
