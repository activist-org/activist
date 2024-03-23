<template>
  <div class="card-style flex justify-center md:justify-start">
    <div class="flex h-fit w-full flex-col p-2 sm:px-5 sm:py-3">
      <slot />
      <div class="flex items-center space-x-6 pt-4">
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
