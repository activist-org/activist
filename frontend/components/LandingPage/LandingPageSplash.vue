<template>
  <div
    class="flex flex-col w-full pt-32 pb-16 space-y-8 sm:bg-red-300 md:bg-orange-300 lg:bg-yellow-300 xl:bg-green-300 2xl:bg-blue-300"
  >
    <!--  bg-light-distinct dark:bg-dark-distinct text-light-text dark:text-dark-text -->
    <p class="text-5xl text-center">{{ $t("landing-header") }}</p>
    <div class="flex justify-center">
      <p class="max-w-xl text-2xl text-center">
        We're building a place for people the world over to collaborate on the
        issues that mater most. We're open-source, community driven and would
        love your feedback! Join our newsletter and we'll be in touch ✊
      </p>
    </div>
    <div class="flex justify-center rounded-md">
      <LabeledBtn
        :cta="true"
        label="Learn more"
        linkTo="/about"
        fontSize="xl"
      />
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath();
</script>
