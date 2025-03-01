<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="flex h-2 w-full items-center justify-between border-b border-section-div bg-layer-2 md:h-8"
  >
    <div
      class="h-full transition-width duration-500 ease-in"
      :class="{
        'bg-distinct-text': type === 'default',
        'bg-action-red': type === 'action',
        'bg-learn-blue': type === 'learn',
      }"
      :style="{ width: `${percent}%` }"
    ></div>
    <NuxtLink
      class="hidden h-full items-center space-x-3 bg-cta-orange px-3 text-primary-text hover:bg-cta-orange/80 dark:bg-cta-orange/10 dark:text-cta-orange dark:hover:bg-cta-orange/25 md:flex"
      :to="localePath('/')"
      :aria-label="
        $t(
          'i18n.components.indicator_process_progress.close_process_aria_label'
        )
      "
    >
      <Icon :name="IconMap.X_LG" />
      <span>{{
        $t("i18n.components.indicator_process_progress.close_process")
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
