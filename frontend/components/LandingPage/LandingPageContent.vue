<template>
  <div
    v-if="contentPosition === 'left'"
    class="flex items-center justify-center space-x-36 py-24 text-light-text dark:text-dark-text"
  >
    <div class="flex flex-col items-start max-w-md space-y-4">
      <p class="text-4xl font-semibold">{{ header }}</p>
      <p
        class="text-xl text-transform: uppercase text-light-special-text dark:text-dark-special-text"
      >
        {{ tagline }}
      </p>
      <p class="text-md">
        {{ text }}
      </p>
      <NuxtLink :to="`${btnURL1}`">
        <CTABtn :label="`${btnText1}`" fontSize='xl' class="mt-4" />
      </NuxtLink>
    </div>
    <div
      class="w-[450px] h-[580px] rounded-xl bg-light-placeholder dark:bg-dark-placeholder"
    ></div>
  </div>
  <div
    v-else-if="contentPosition === 'right'"
    class="flex items-center justify-center space-x-36 py-20 text-light-text dark:text-dark-text bg-light-header-bg dark:bg-dark-header-bg"
  >
    <div
      class="w-[450px] h-[580px] rounded-xl bg-light-placeholder dark:bg-dark-placeholder"
    ></div>
    <div class="flex flex-col items-start max-w-md space-y-4">
      <p class="text-4xl font-semibold">{{ header }}</p>
      <p
        class="text-xl text-transform: uppercase text-light-special-text dark:text-dark-special-text"
      >
        {{ tagline }}
      </p>
      <p class="text-md">
        {{ text }}
      </p>
      <NuxtLink :to="`${btnURL1}`">
        <CTABtn :label="`${btnText1}`" fontSize='xl' class="mt-4" />
      </NuxtLink>
    </div>
  </div>
  <div
    v-else-if="contentPosition === 'top'"
    class="flex items-center justify-center text-light-text dark:text-dark-text py-24"
  >
    <div class="flex flex-col items-center max-w-2xl space-y-4">
      <p class="text-4xl text-center font-semibold">{{ header }}</p>
      <p
        class="text-xl text-transform: uppercase text-center text-light-special-text dark:text-dark-special-text"
      >
        {{ tagline }}
      </p>
      <p class="text-center text-md">
        {{ text }}
      </p>
      <div class="flex flex-row space-x-12">
        <NuxtLink :to="`${btnURL1}`"
          ><CTABtn :label="`${btnText1}`" fontSize='xl' class="mt-4"
        /></NuxtLink>
        <NuxtLink :to="`${btnURL2}`"
          ><CTABtn :label="`${btnText2}`" fontSize='xl' class="mt-4"
        /></NuxtLink>
      </div>
      <div>
        <LandingPageImageGrid class="mt-8"/>
      </div>
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
}>();
</script>
