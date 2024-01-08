<template>
  <TooltipBase class="rounded-md">
    <div class="space-y-2">
      <BtnAction
        @keydown="onTabPress((isLastItem = false), (event = $event))"
        class="flex max-h-[40px] w-full"
        label="components.btn-action.support"
        leftIcon="IconSupport"
        fontSize="lg"
        :ariaLabel="$t('components.btn-action.support-organization-aria-label')"
      />
      <BtnRouteInternal
        class="flex max-h-[40px] w-full"
        label="components.btn-route-internal.join"
        leftIcon="IconJoin"
        linkTo="/"
        fontSize="lg"
        :ariaLabel="
          $t('components.btn-route-internal.join-organization-aria-label')
        "
      />
      <BtnAction
        @keydown="onTabPress((isLastItem = true), (event = $event))"
        class="flex max-h-[40px] w-full"
        label="components.btn-action.share"
        leftIcon="bi:box-arrow-up"
        fontSize="lg"
        :ariaLabel="$t('components.btn-action.share-organization-aria-label')"
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
