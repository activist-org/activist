<template>
  <div
    class="flex items-center justify-between border w-max h-max cursor-pointer style-cta elem-shadow-sm space-x-2"
    :class="{
      'style-cta': active,
      'style-cta-secondary': !active,
      'pl-2 pr-3 rounded-full': !isSelector,
      'py-1 sm:py-0 rounded-lg pl-4 pr-5 sm:pl-2 sm:pr-3': isSelector,
    }"
  >
    <div class="flex items-center" :class="{ 'max-sm:flex-grow': isSelector }">
      <Icon class="flex-shrink-0 w-5 h-5 my-1" name="bi:globe" size="1em" />
      <p class="pl-2 text-base font-bold text-center select-none">
        {{ $t(topic) }}
      </p>
    </div>
    <Icon v-if="active && isSelector" name="bi:x-lg" size="20" />
  </div>
</template>

<script setup lang="ts">
export interface Props {
  topic: string;
  active?: boolean;
  isSelector?: boolean;
}

withDefaults(defineProps<Props>(), {
  active: true,
  isSelector: false,
});
</script>
