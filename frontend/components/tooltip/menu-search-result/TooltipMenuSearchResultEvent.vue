<template>
  <TooltipBase class="rounded-md">
    <div class="space-y-2">
      <BtnLabeled
        class="flex truncate max-h-[40px] w-full"
        label="components.btn-labeled.support"
        leftIcon="IconSupport"
        linkTo=""
        fontSize="lg"
        :ariaLabel="$t('components.btn-labeled.support-event-aria-label')"
      />
      <BtnLabeled
        class="flex truncate max-h-[40px] w-full"
        label="components.btn-labeled.attend"
        leftIcon="IconJoin"
        linkTo=""
        fontSize="lg"
        :ariaLabel="$t('components.btn-labeled.attend-aria-label')"
      />
      <BtnLabeled
        @keydown.tab="$emit('tab')"
        class="flex truncate max-h-[40px] w-full"
        label="components.btn-labeled.share"
        leftIcon="bi:box-arrow-up"
        linkTo=""
        fontSize="lg"
        :ariaLabel="$t('components.btn-labeled.share-event-aria-label')"
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
