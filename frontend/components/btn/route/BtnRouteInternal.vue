<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLink
    :id="id"
    :to="localePath(`${linkTo}`)"
    class="btn-base-class rounded-md xl:rounded-lg"
    :class="btnDynamicClass"
    :aria-label="$t(ariaLabel)"
  >
    <BtnIconsLabel
      :label="label"
      :hideLabelOnMobile="hideLabelOnMobile"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      :iconSize="iconSize"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BtnRoute } from "~/types/btn-props";
import { getBtnDynamicClass } from "~/utils/btnUtils";

const props = defineProps<BtnRoute>();

const localePath = useLocalePath();

const btnDynamicClass = getBtnDynamicClass(
  props.cta,
  props.fontSize,
  props.isDisabled
);
</script>
