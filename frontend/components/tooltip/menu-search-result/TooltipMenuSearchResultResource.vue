<template>
  <TooltipBase class="rounded-md">
    <div class="space-y-2">
      <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-[40px] w-full"
        label="components._global.star"
        leftIcon="bi:star"
        fontSize="lg"
        :ariaLabel="$t('components._global.star')"
      />
      <BtnAction
        @keydown="handleTabPress(true, $event)"
        class="flex max-h-[40px] w-full"
        label="components.btn-action.share"
        leftIcon="bi:box-arrow-up"
        fontSize="lg"
        :ariaLabel="$t('components.btn-action.share')"
      />
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
defineProps<{
  location?: string;
}>();

const emit = defineEmits(["tab"]);
const { handleTabPress } = useTabNavigationEmit(emit);
</script>
