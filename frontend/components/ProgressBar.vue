<template>
  <div
    class="flex items-center justify-between w-full h-2 md:h-12 bg-light-header dark:bg-dark-header"
  >
    <div
      :class="[
        'h-full transition-width ease-in duration-500',
        {
          'bg-light-placeholder dark:bg-dark-placeholder': type === 'default',
          'bg-light-act-red dark:bg-dark-act-red': type === 'act',
          'bg-light-learn-blue dark:bg-dark-learn-blue': type === 'learn',
        },
      ]"
      :style="{ width: `${percent}%` }"
    ></div>
    <button
      class="items-center hidden h-full px-3 md:flex bg-light-cta-orange hover:bg-light-cta-orange-hover dark:bg-dark-cta-orange dark:hover:bg-dark-cta-orange-hover"
      @click="$emit('close', progress, percent)"
    >
      <Icon name="bi:x" size="24px" />
      <span class="pl-1">Close</span>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  type?: "default" | "act" | "learn";
  progress: number;
  start?: number;
  end?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: "default",
  start: 0,
  end: 100,
});

const emits = defineEmits<{
  close: [progress: number, percent: number];
}>();

const percent = computed(
  () => ((props.progress - props.start) / (props.end - props.start)) * 100
);
</script>
