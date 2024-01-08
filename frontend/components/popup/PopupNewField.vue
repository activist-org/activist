<template>
  <div
    class="flex flex-col px-4 pt-2 pb-3 elem-shadow-md space-y-2 card-style bg-light-distinct dark:bg-dark-distinct w-fit"
  >
    <div class="relative flex">
      <p class="pl-1 responsive-h5">
        {{ title }}
      </p>
      <div
        @click="emit('on-close-clicked')"
        class="absolute right-0 mr-1 text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text"
      >
        <Icon class="w-6 h-6" name="bi:x-circle-fill" />
      </div>
    </div>
    <input
      v-model="inputValue"
      ref="input"
      class="h-8 p-2 bg-transparent border rounded-sm w-52 border-light-text dark:border-dark-text focus-brand"
      type="text"
      :placeholder="fieldNamePrompt"
    />
    <textarea
      v-if="descriptionPrompt"
      class="p-1 bg-transparent border rounded-sm resize-none border-light-text dark:border-dark-text focus-brand min-w-[75%] min-h-[50%]"
      name="message"
      rows="3"
      cols="10"
      :placeholder="descriptionPrompt"
    ></textarea>
    <div @click="emit('on-cta-clicked', inputValue)" class="mt-1">
      <BtnAction
        :cta="true"
        linkTo="placeholder-link"
        :label="ctaBtnLabel"
        fontSize="sm"
        leftIcon="bi:plus-lg"
        :ariaLabel="ctaBtnAriaLabel"
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
  ctaBtnAriaLabel: string;
}>();

const inputValue = ref<HTMLInputElement | null>(null);

const emit = defineEmits(["on-cta-clicked", "on-close-clicked"]);
</script>
