<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <a
    :id="id"
    class="btn-base-class rounded-md xl:rounded-lg"
    :class="btnDynamicClass"
    :href="linkTo"
    :aria-label="$t(ariaLabel)"
    target="_blank"
  >
    <BtnIconsLabel
      :label="label"
      :hideLabelOnMobile="hideLabelOnMobile"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      :iconSize="iconSize"
    />
  </a>
</template>

<script setup lang="ts">
import type { BtnRoute } from "~/types/btn-props";
import { getBtnDynamicClass } from "~/utils/btnUtils";

const props = defineProps<BtnRoute>();

const btnDynamicClass = getBtnDynamicClass(
  props.cta,
  props.fontSize,
  props.isDisabled
);
</script>
