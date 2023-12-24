<template>
  <TooltipBase class="rounded-md">
    <div class="space-y-2">
      <BtnLabeled
        class="flex truncate max-h-[40px] w-full"
        label="components._global.star"
        leftIcon="bi:star"
        linkTo=""
        fontSize="lg"
        :ariaLabel="$t('components._global.star')"
      />
      <BtnLabeled
        @keydown.tab="$emit('tab')"
        class="flex truncate max-h-[40px] w-full"
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

defineEmits(['tab'])
</script>
