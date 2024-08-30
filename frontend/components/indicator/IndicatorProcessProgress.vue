<template>
  <div
    class="flex h-2 w-full items-center justify-between border-b border-light-section-div bg-light-layer-2 dark:border-dark-section-div dark:bg-dark-layer-2 md:h-8"
  >
    <div
      class="h-full transition-width duration-500 ease-in"
      :class="{
        'bg-light-distinct-text dark:bg-dark-distinct-text': type === 'default',
        'bg-light-action-red dark:bg-dark-action-red': type === 'action',
        'bg-light-learn-blue dark:bg-dark-learn-blue': type === 'learn',
      }"
      :style="{ width: `${percent}%` }"
    ></div>
    <NuxtLink
      class="hidden h-full items-center space-x-3 bg-light-cta-orange px-3 text-light-text hover:bg-light-cta-orange/80 dark:bg-dark-cta-orange/10 dark:text-dark-cta-orange dark:hover:bg-dark-cta-orange/25 md:flex"
      :to="localePath('/')"
      :aria-label="
        $t('components.indicator_process_progress.close_process_aria_label')
      "
    >
      <Icon :name="IconMap.X_LG" />
      <span>{{
        $t("components.indicator_process_progress.close_process")
      }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

export interface Props {
  type?: "default" | "action" | "learn";
  progress: number;
  start?: number;
  end?: number;
}

const localePath = useLocalePath();

const props = withDefaults(defineProps<Props>(), {
  type: "default",
  start: 0,
  end: 100,
});

const percent = computed(
  () => ((props.progress - props.start) / (props.end - props.start)) * 100
);
</script>
