<template>
  <div
    class="flex items-center justify-between w-full h-2 border-b md:h-8 bg-light-layer-2 dark:bg-dark-layer-2 border-light-section-div dark:border-dark-section-div"
  >
    <div
      :class="[
        'h-full transition-width motion-reduce:transition-none ease-in duration-500',
        {
          'bg-light-placeholder dark:bg-dark-placeholder': type === 'default',
          'bg-light-action-red dark:bg-dark-action-red': type === 'action',
          'bg-light-learn-blue dark:bg-dark-learn-blue': type === 'learn',
        },
      ]"
      :style="{ width: `${percent}%` }"
    ></div>
    <NuxtLink
      class="items-center hidden h-full px-3 md:flex space-x-3 bg-light-cta-orange hover:bg-light-cta-orange/80 dark:bg-dark-cta-orange/10 dark:hover:bg-dark-cta-orange/25 text-light-text dark:text-dark-cta-orange"
      :to="localePath('/')"
      :aria-label="$t('components.progress-bar.close-process-aria-label')"
    >
      <Icon name="bi:x-lg" />
      <span>{{ $t("components.progress-bar.close-process") }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

export interface Props {
  type?: "default" | "action" | "learn";
  progress: number;
  start?: number;
  end?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: "default",
  start: 0,
  end: 100,
});

const percent = computed(
  () => ((props.progress - props.start) / (props.end - props.start)) * 100
);
</script>
