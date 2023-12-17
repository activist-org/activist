<template>
  <TooltipBase class="rounded-md">
    <div class="space-y-2">
      <BtnLabeled
        class="flex truncate max-h-[40px] w-full"
        label="components.btn-labeled.support"
        leftIcon="IconSupport"
        linkTo=""
        fontSize="lg"
        :ariaLabel="
          $t('components.btn-labeled.support-organization-aria-label')
        "
      />
      <BtnLabeled
        class="flex truncate max-h-[40px] w-full"
        label="components.btn-labeled.join"
        leftIcon="IconJoin"
        linkTo=""
        fontSize="lg"
        :ariaLabel="$t('components.btn-labeled.join-organization-aria-label')"
      />
      <BtnLabeled
        class="flex truncate max-h-[40px] w-full"
        label="components.btn-labeled.share"
        leftIcon="bi:box-arrow-up"
        linkTo=""
        fontSize="lg"
        :ariaLabel="$t('components.btn-labeled.share-organization-aria-label')"
      />
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
defineProps<{
  location?: string;
}>();
</script>
