<template>
  <div
    class="cursor-pointer"
    style="
      width: 100%;
      height: 100%;
      justify-content: flex-start;
      align-items: center;
      gap: 12px;
      display: inline-flex;
    "
  >
    <div :style="iconStyle">
      <svg
        width="32"
        height="32"
        viewBox="0 0 16 16"
        fill="props.fillColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path :d="props.iconPath" />
      </svg>
    </div>
    <div :textStyle="props.textStyle">{{ props.text }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const iconStyle = {
  width: "28px",
  height: "28px",
  position: "relative",
} as const;

const props = defineProps<{
  iconPath: string;
  fillColor: string;
  text: string;
  textStyle: Object;
}>();
</script>
