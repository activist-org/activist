<template>
    <TooltipBase >
      <div class="space-y-4">
        <BtnLabeled
          class="flex text-align: left truncate max-h-[40px] w-full space-y-4"
          label="components.btn-labeled.support-aria-label"
          leftIcon="IconSupport"
          linkTo=""
          fontSize="lg"
          :ariaLabel="$t('components.btn-labeled.support-aria-label')"
        />
        <BtnLabeled
          class="flex text-align: left truncate max-h-[40px] w-full space-y-4"
          label="components.btn-labeled.join-aria-label"
          leftIcon="IconJoin"
          linkTo=""
          fontSize="lg"
          :ariaLabel="$t('components.btn-labeled.join-aria-label')"
        />
        <BtnLabeled
          class="flex text-align: left truncate max-h-[40px] w-full space-y-4"
          label="components.btn-labeled.share-aria-label"
          leftIcon="bi:box-arrow-up"
          linkTo=""
          fontSize="lg"
          :ariaLabel="$t('components.btn-labeled.share-aria-label')"
        />
      </div>
    </TooltipBase>
  </template>

  <script setup lang="ts">  
  defineProps<{
    location?: string;
  }>();
  </script>