<template>
  <button
    class="btn-base-class rounded-md xl:rounded-lg"
    :class="btnDynamicClass"
    :aria-label="$t(ariaLabel)"
  >
    <BtnIconsLabel
      :label="label"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      :iconSize="iconSize"
      :counter="counter"
      :hideLabelOnMobile="hideLabelOnMobile"
    />
  </button>
</template>

<script setup lang="ts">
import type { BtnAction } from "~/types/btn-props";
import { getBtnDynamicClass } from "~/utils/btnUtils";

const props = defineProps<BtnAction>();

const btnDynamicClass = getBtnDynamicClass(props.cta, props.fontSize);
</script>
