<template>
  <div
    class="elem-shadow-md card-style flex w-fit flex-col space-y-2 bg-light-layer-1 px-4 pb-3 pt-2 dark:bg-dark-layer-1"
  >
    <div class="relative flex">
      <p class="responsive-h5 pl-1">
        {{ title }}
      </p>
      <div
        @click="emit('on-close-clicked')"
        @keypress.enter="emit('on-close-clicked')"
        role="button"
        tabindex="0"
        class="absolute right-0 mr-1 text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text hover:dark:text-dark-text"
      >
        <Icon class="h-6 w-6" name="bi:x-circle-fill" />
      </div>
    </div>
    <label for="popup-input" class="sr-only"> {{ fieldNamePrompt }}</label>
    <input
      v-model="inputValue"
      ref="input"
      id="popup-input"
      class="focus-brand h-8 w-52 rounded-sm border border-light-text bg-transparent p-2 dark:border-dark-text"
      type="text"
      :placeholder="fieldNamePrompt"
    />
    <label for="popup-textarea" class="sr-only"> {{ descriptionPrompt }}</label>
    <textarea
      v-if="descriptionPrompt"
      id="popup-textarea"
      class="focus-brand min-h-[50%] min-w-[75%] resize-none rounded-sm border border-light-text bg-transparent p-1 dark:border-dark-text"
      name="message"
      rows="3"
      cols="10"
      :placeholder="descriptionPrompt"
    ></textarea>
    <div
      @click="emit('on-cta-clicked', inputValue)"
      @keypress.enter="emit('on-cta-clicked', inputValue)"
      role="button"
      tabindex="0"
      class="mt-1"
    >
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
