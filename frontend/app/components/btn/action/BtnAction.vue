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

/**
 * Loads the dynamic classes for the button based on the provided cta and fontSize props. This function utilizes the getBtnDynamicClass utility function to determine the appropriate classes to apply to the button, allowing for dynamic styling based on the button's intended call-to-action (cta) and font size. The resulting classes are stored in the btnDynamicClass variable, which is then used in the template to style the button accordingly.
 * @returns A string of classes that should be applied to the button element. These classes are determined based on the cta and fontSize props passed to the component, allowing for dynamic styling of the button based on its intended use and appearance. The getBtnDynamicClass utility function is responsible for calculating the appropriate classes based on these props, ensuring that the button is styled correctly for its context within the user interface.
 */
function loadBtnDynamicClass() {
  return getBtnDynamicClass(props.cta, props.fontSize);
}

let btnDynamicClass = loadBtnDynamicClass();

watchEffect(() => {
  btnDynamicClass = loadBtnDynamicClass();
});
</script>
