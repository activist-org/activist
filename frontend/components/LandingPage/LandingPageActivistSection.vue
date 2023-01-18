<template>
  <div
    v-if="contentPosition === 'left'"
    class="inline-flex items-center space-x-40 text-light-text dark:text-dark-text"
  >
    <div class="flex flex-col items-start max-w-md space-y-4">
      <ActivistLogo class="h-16" />
      <p
        class="text-xl text-transform: uppercase text-light-special-text dark:text-dark-special-text"
      >
        About us and our goals
      </p>
      <ul class="mx-5 text-md list-disc">
        <li>Not aligned with any government</li>
        <li>Transparent finances and decision making</li>
        <li>A Berlin based non-profit with global affiliates</li>
        <li>Our position is to make activism easier and more effective</li>
        <li>You take it from there</li>
      </ul>
      <NuxtLink :to="`${btnURL1}`">
        <CTABtn :label="`${btnText1}`" fontSize="xl" class="mt-4" />
      </NuxtLink>
    </div>
    <div
      class="w-[450px] h-[580px] rounded-xl bg-light-placeholder dark:bg-dark-placeholder"
    ></div>
  </div>
  <div
    v-else-if="contentPosition === 'right'"
    class="inline-flex items-center space-x-36 text-light-text dark:text-dark-text"
  >
    <div
      class="w-[450px] h-[580px] rounded-xl bg-light-placeholder dark:bg-dark-placeholder"
    ></div>
    <div class="flex flex-col items-start max-w-md space-y-4">
      <ActivistLogo class="h-16 mb-2" />
      <p
        class="text-xl text-transform: uppercase text-light-special-text dark:text-dark-special-text"
      >
        About us and our goals
      </p>
      <ul class="mx-5 text-md list-disc">
        <li>Not aligned with any government</li>
        <li>Transparent finances and decision making</li>
        <li>A Berlin based non-profit with global affiliates</li>
        <li>Our position is to make activism easier and more effective</li>
        <li>You take it from there</li>
      </ul>
      <NuxtLink :to="`${btnURL1}`">
        <CTABtn :label="`${btnText1}`" fontSize="xl" class="mt-4" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  contentPosition?: string;
  btnText1?: string;
  btnURL1?: string;
}>();
</script>
