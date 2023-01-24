<template>
  <div
    v-if="contentPosition === 'left'"
    class="flex items-center justify-center py-20 space-x-36 text-light-text dark:text-dark-text"
  >
    <div class="flex flex-col items-start max-w-md space-y-4">
      <LogosActivist class="h-16" />
      <p
        class="text-xl uppercase tracking-wider text-transform: text-light-special-text dark:text-dark-special-text"
      >
        About us and our goals
      </p>
      <ul class="mx-5 list-disc text-md">
        <li>Open-source and community driven</li>
        <li>Transparent finances and decision making</li>
        <li>A Berlin based non-profit with global affiliates</li>
        <li>Our position is to make activism easier and more effective</li>
        <li>You take it from there ✊</li>
      </ul>
      <LabeledBtn
        :cta="true"
        :label="`${btnText1}`"
        :linkTo="`${btnURL1}`"
        fontSize="xl"
        class="mt-4"
      />
    </div>
    <div
      class="w-[450px] h-[580px] rounded-xl bg-light-placeholder dark:bg-dark-placeholder"
    ></div>
  </div>
  <div
    v-else-if="contentPosition === 'right'"
    class="flex items-center justify-center py-20 space-x-36 text-light-text dark:text-dark-text bg-light-header dark:bg-dark-header"
  >
    <div
      class="w-[450px] h-[580px] rounded-xl bg-light-placeholder dark:bg-dark-placeholder"
    ></div>
    <div class="flex flex-col items-start max-w-md space-y-4">
      <LogosActivist class="h-16 mb-2" />
      <p
        class="text-xl uppercase text-transform: text-light-special-text dark:text-dark-special-text"
      >
        About us and our goals
      </p>
      <ul class="mx-5 list-disc text-md">
        <li>Open-source and community driven</li>
        <li>Transparent finances and decision making</li>
        <li>A Berlin based non-profit with global affiliates</li>
        <li>Our position is to make activism easier and more effective</li>
        <li>You take it from there ✊</li>
      </ul>
      <LabeledBtn
        :cta="true"
        :label="`${btnText1}`"
        :linkTo="`${btnURL1}`"
        fontSize="xl"
        class="mt-4"
      />
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
