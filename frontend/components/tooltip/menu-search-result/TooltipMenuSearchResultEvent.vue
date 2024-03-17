<template>
  <TooltipBase class="rounded-md">
    <div class="flex-col space-y-2">
      <BtnAction
        @keydown="onTabPress((isLastItem = false), (event = $event))"
        class="flex max-h-[40px] w-full"
        label="components.btn-action.support"
        leftIcon="IconSupport"
        fontSize="lg"
        :ariaLabel="$t('components.btn-action.support-event-aria-label')"
      />
      <BtnAction
        class="flex max-h-[40px] w-full items-center"
        label="components.btn-action.attend"
        leftIcon="IconJoin"
        fontSize="lg"
        :ariaLabel="$t('components.btn-action.attend-aria-label')"
      />
      <BtnAction
        @keydown="onTabPress((isLastItem = true), (event = $event))"
        class="flex max-h-[40px] w-full items-center"
        label="components.btn-action.share"
        leftIcon="bi:box-arrow-up"
        fontSize="lg"
        :ariaLabel="$t('components.btn-action.share-event-aria-label')"
      />
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
defineProps<{
  location?: string;
}>();

const emit = defineEmits(["tab"]);
const { onTabPress } = useTabNavigationEmit(emit);
</script>
