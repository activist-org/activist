<template>
  <div class="flex justify-center card-style md:justify-start">
    <div class="flex flex-col w-full p-2 sm:px-5 sm:py-3 h-fit">
      <slot />
      <div class="flex items-center pt-4 space-x-6">
        <FriendlyCaptcha />
        <BtnAction
          class="flex max-h-[48px] md:max-h-[40px]"
          :cta="true"
          :label="ctaLabel"
          fontSize="sm"
          :ariaLabel="ctaAriaLabel"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  ctaLabel: string;
  ctaAriaLabel: string;
}>();
</script>
