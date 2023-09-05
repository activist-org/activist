<template>
  <div
    class="flex flex-col px-4 pt-2 pb-3 shadow-md space-y-2 card-style bg-light-header dark:bg-dark-header w-fit shadow-zinc-700"
  >
    <div class="relative flex">
      <p class="pl-1 responsive-h5">{{ title }}</p>
      <div
        class="absolute right-0 mr-1 text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text"
        @click="emit('on-close-clicked')"
      >
        <Icon name="bi:x-circle-fill" class="w-6 h-6" />
      </div>
    </div>
    <input
      class="h-8 p-2 bg-transparent border rounded-sm w-52 border-light-text dark:border-dark-text focus-brand"
      ref="input"
      type="text"
      :placeholder="fieldNamePrompt"
      v-model="inputValue"
    />
    <textarea
      class="p-1 bg-transparent border rounded-sm resize-none border-light-text dark:border-dark-text focus-brand min-w-[75%] min-h-[50%]"
      v-if="descriptionPrompt"
      name="message"
      rows="3"
      cols="10"
      :placeholder="descriptionPrompt"
    ></textarea>
    <div @click="emit('on-cta-clicked', inputValue)" class="mt-1">
      <BtnLabeled
        :cta="true"
        linkTo="placeholder-link"
        :label="ctaBtnLabel"
        fontSize="base"
        leftIcon="bi:plus-lg"
        :alternateText="ctaBtnAlternateText"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  fieldNamePrompt: string;
  descriptionPrompt?: string;
  ctaBtnLabel: string;
  ctaBtnAlternateText: string;
}>();

const inputValue = ref<HTMLInputElement | null>(null);

const emit = defineEmits(["on-cta-clicked", "on-close-clicked"]);
</script>
