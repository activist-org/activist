<template>
  <TooltipBase>
    <div class="space-y-4">
      <BtnLabeled
        class="flex text-align: left truncate max-h-[40px] w-full space-y-4"
        label="components.grid-github-shields.star"
        linkTo=""
        fontSize="lg"
        :ariaLabel="$t('components.grid-github-shields.star')"
      />
      <BtnLabeled
        class="flex text-align: left truncate max-h-[40px] w-full space-y-4"
        label="components.btn-labeled.share"
        leftIcon="bi:box-arrow-up"
        linkTo=""
        fontSize="lg"
        :ariaLabel="$t('components.btn-labeled.share')"
      />
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
defineProps<{
  location?: string;
}>();
</script>
