<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <button
    :id="id"
    :aria-label="$t(ariaLabel)"
    class="btn-base-class rounded-md xl:rounded-lg"
    :class="btnDynamicClass"
  >
    <Icon
      v-if="isLoading"
      :name="IconMap.SPINNER"
      :size="iconSize || '1.5em'"
    />
    <BtnIconsLabel
      v-else
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

watch(props, (newVal) => {
  if (newVal) {
    // If loading becomes true, we might want to disable the button or add a loading class.
    // This is just an example, adjust as needed.
    console.log(props);
  }
},{immediate: true, deep: true});
function loadBtnDynamicClass() {
  return getBtnDynamicClass(props.cta, props.fontSize);
}

let btnDynamicClass = loadBtnDynamicClass();

watchEffect(() => {
  btnDynamicClass = loadBtnDynamicClass();
});
</script>
