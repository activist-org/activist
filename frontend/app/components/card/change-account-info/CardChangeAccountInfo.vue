<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style flex justify-center md:justify-start">
    <div class="flex h-fit w-full flex-col p-2 sm:px-5 sm:py-3">
      <slot />
      <div class="flex items-center space-x-6 pt-4">
        <!-- <FriendlyCaptcha /> -->
        <BtnAction
          :ariaLabel="ctaAriaLabel"
          class="flex max-h-12 md:max-h-10"
          :cta="true"
          fontSize="sm"
          :label="ctaLabel"
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
