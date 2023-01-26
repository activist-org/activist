<template>
  <div
    class="flex flex-col w-full pt-8 pb-6 bg-light-distinct dark:bg-dark-distinct text-light-text dark:text-dark-text sm:pt-12 sm:pb-10 md:pt-16 lg:pt-20 xl:pt-32 xl:pb-16 space-y-4 sm:space-y-6 xl:space-y-8"
  >
    <p class="text-2xl text-center sm:text-3xl md:text-4xl xl:text-5xl">{{ $t("landing-header") }}</p>
    <div class="flex justify-center">
      <p class="w-10/12 text-base text-center md:text-lg md:max-w-lg sm:text-xl xl:max-w-xl xl:text-2xl">
        {{ $t("landing-message") }}
      </p>
    </div>
    <div class="flex justify-center rounded-md">
      <LabeledBtn
        :cta="true"
        :label="`${btnText1}`"
        linkTo="/about"
        fontSize="xl"
      />
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath();
const btnText1 = "learn-more"
</script>
