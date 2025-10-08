<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <button
    :id="id"
    :aria-label="$t(ariaLabel)"
    class="btn-base-class rounded-md xl:rounded-lg"
    :class="btnDynamicClass"
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
import type { BtnAction } from "~/types/btn-props";

import { getBtnDynamicClass } from "~/utils/btnUtils";

const props = defineProps<BtnAction>();

function loadBtnDynamicClass() {
  return getBtnDynamicClass(props.cta, props.fontSize);
}

let btnDynamicClass = loadBtnDynamicClass();

watchEffect(() => {
  btnDynamicClass = loadBtnDynamicClass();
});
</script>
