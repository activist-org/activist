<template>
  <div
    class="flex flex-col w-full pt-32 pb-16 space-y-8 bg-red-300 sm:bg-orange-300 md:bg-yellow-300 lg:bg-green-300 xl:bg-blue-300 2xl:bg-violet-300"
  >
    <!--  bg-light-distinct dark:bg-dark-distinct text-light-text dark:text-dark-text -->
    <p class="text-5xl text-center">{{ $t("landing-header") }}</p>
    <div class="flex justify-center">
      <p class="max-w-xl text-2xl text-center">
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
