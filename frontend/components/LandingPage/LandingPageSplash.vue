<template>
  <div
    class="flex flex-col w-full pt-32 pb-16 space-y-8 bg-light-distinct-bg dark:bg-dark-distinct-bg text-light-text dark:text-dark-text"
  >
    <p class="text-5xl text-center">{{ $t('landing-header') }}</p>
    <div class="flex justify-center">
      <p class="max-w-xl text-2xl text-center">
        We're building a place for people the world over to collaborate on the
        issues that mater most. We're open-source, community driven and would
        love your feedback! Join our newsletter and we'll be in touch ✊
      </p>
    </div>
    <div class="flex justify-center rounded-md">
      <CTABtn label="Learn more" linkTo="/about" fontSize="xl"/>
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath()
</script>
