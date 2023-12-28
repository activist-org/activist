<template>
  <TooltipBase class="rounded-md">
    <div class="space-y-2">
      <BtnLabeled
        @keydown="onTabPress((isLastItem = false), (event = $event))"
        class="flex max-h-[40px] w-full"
        label="components.btn-labeled.support"
        leftIcon="IconSupport"
        linkTo=""
        fontSize="lg"
        :ariaLabel="$t('components.btn-labeled.support-user-aria-label')"
      />
      <BtnLabeled
        @keydown="onTabPress((isLastItem = true), (event = $event))"
        class="flex max-h-[40px] w-full"
        label="components.btn-labeled.share"
        leftIcon="bi:box-arrow-up"
        linkTo=""
        fontSize="lg"
        :ariaLabel="$t('components.btn-labeled.share-user-aria-label')"
      />
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
import useTabNavigationEmit from "~/composables/useTabNavigationEmit";

defineProps<{
  location?: string;
}>();

const emit = defineEmits(["tab"]);
const { onTabPress } = useTabNavigationEmit(emit);
</script>
