<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <button
    :id="id"
    :aria-label="$t(ariaLabel)"
    class="btn-base-class rounded-md xl:rounded-lg"
    :class="[
      btnDynamicClass,
      !cta && 'style-cta bg-[#C8C8C8] hover:bg-[#C8C8C8]/70',
      cta && 'style-cta',
    ]"
  >
    <BtnIconsLabel
      :counter="counter"
      :hideLabelOnMobile="hideLabelOnMobile"
      :iconSize="iconSize"
      :label="label"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
    />
  </button>
</template>

<script setup lang="ts">
import type { BtnAction } from "#shared/types/components-props";

const props = defineProps<BtnAction>();
const btnDynamicClass = computed(() =>
  getBtnDynamicClass(props.cta, props.fontSize)
);
</script>
