<template>
  <div
    v-if="contentPosition === 'left'"
    class="flex items-center justify-center py-24 space-x-36 text-light-text dark:text-dark-text"
  >
    <div class="flex flex-col items-start max-w-md space-y-4">
      <p class="text-4xl font-semibold">{{ header }}</p>
      <p
        class="text-xl uppercase text-transform: text-light-special-text dark:text-dark-special-text"
      >
        {{ tagline }}
      </p>
      <p class="text-md">
        {{ text }}
      </p>
      <CTABtn :label="`${btnText1}`" :linkTo="`${btnURL1}`" fontSize='xl' class="mt-4" />
    </div>
    <div
      class="w-[450px] h-[580px] rounded-xl bg-light-placeholder dark:bg-dark-placeholder"
    ></div>
  </div>
  <div
    v-else-if="contentPosition === 'right'"
    class="flex items-center justify-center py-20 space-x-36 text-light-text dark:text-dark-text bg-light-header-bg dark:bg-dark-header-bg"
  >
    <div
      class="w-[450px] h-[580px] rounded-xl bg-light-placeholder dark:bg-dark-placeholder"
    ></div>
    <div class="flex flex-col items-start max-w-md space-y-4">
      <p class="text-4xl font-semibold">{{ header }}</p>
      <p
        class="text-xl uppercase text-transform: text-light-special-text dark:text-dark-special-text"
      >
        {{ tagline }}
      </p>
      <p class="text-md">
        {{ text }}
      </p>
      <CTABtn :label="`${btnText1}`" :linkTo="`${btnURL1}`" fontSize='xl' class="mt-4" />
    </div>
  </div>
  <div
    v-else-if="contentPosition === 'top'"
    class="flex items-center justify-center pt-24 text-light-text dark:text-dark-text pb-18"
  >
    <div class="flex flex-col items-center max-w-2xl space-y-4">
      <p class="text-4xl font-semibold text-center">{{ header }}</p>
      <p
        class="text-xl text-center uppercase text-transform: text-light-special-text dark:text-dark-special-text"
      >
        {{ tagline }}
      </p>
      <p class="text-center text-md">
        {{ text }}
      </p>
      <div class="flex flex-row space-x-12">
        <CTABtn :label="`${btnText1}`" :linkTo="`${btnURL1}`" fontSize='xl' class="mt-4" />
        <CTABtn :label="`${btnText2}`" :linkTo="`${btnURL2}`" fontSize='xl' class="mt-4" />
      </div>
      <div>
        <LandingPageImageGrid class="mt-8"/>
      </div>
      <p class="pt-12 text-light-special-text dark:text-dark-special-text">{{ underText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  contentPosition?: string;
  header?: string;
  tagline?: string;
  text?: string;
  btnText1?: string;
  btnURL1?: string;
  btnText2?: string;
  btnURL2?: string;
  imageURL?: string;
  underText?: string;
}>();
</script>
