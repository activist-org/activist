<template>
  <div class="flex justify-center card-style md:justify-start">
    <div class="flex flex-col p-2 w-full sm:px-5 sm:py-3 h-fit">
      <slot />
      <div class="flex items-center space-x-6 pt-4">
        <FriendlyCaptcha />
        <BtnLabeled
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
  ctaLabel: String;
  ctaAriaLabel: String;
}>();
</script>
