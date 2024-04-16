<template>
  <div class="flex h-full w-full cursor-pointer items-center gap-3">
    <Icon
      :name="props.iconName"
      :size="props.iconSize ? props.iconSize : '1em'"
    />
    <p :class="props.textUtilityClasses">{{ props.text }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  iconName: string;
  text: string;
  iconSize?: string;
  textUtilityClasses?: string;
}>();
</script>
