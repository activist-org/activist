<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLink
    :id="id"
    :aria-label="$t(ariaLabel)"
    class="btn-base-class rounded-md xl:rounded-lg"
    :class="btnDynamicClass"
    :to="localePath(`${linkTo}`)"
  >
    <BtnIconsLabel
      :hideLabelOnMobile="hideLabelOnMobile"
      :iconSize="iconSize"
      :label="label"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BtnRoute } from "#shared/types/btn-props";

const props = defineProps<BtnRoute>();

const localePath = useLocalePath();

const btnDynamicClass = getBtnDynamicClass(props.cta, props.fontSize);
</script>
