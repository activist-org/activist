<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="style-cta elem-shadow-sm flex h-max w-max cursor-pointer items-center justify-between space-x-2 border"
    :class="{
      'style-cta': active,
      'style-cta-secondary': !active,
      'rounded-full pl-2 pr-3': !isSelector,
      'rounded-lg py-1 pl-4 pr-5 sm:py-0 sm:pl-2 sm:pr-3': isSelector,
    }"
    tabindex="0"
  >
    <div class="flex items-center" :class="{ 'max-sm:flex-grow': isSelector }">
      <Icon class="my-1 h-5 w-5 flex-shrink-0" :name="icon" size="1em" />
      <p class="select-none pl-2 text-center text-base font-bold">
        {{ $t(label) }}
      </p>
    </div>
    <Icon v-if="active && isSelector" :name="IconMap.X_LG" size="20" />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

export interface Props {
  label: string;
  active?: boolean;
  isSelector?: boolean;
  icon: IconMap;
}

withDefaults(defineProps<Props>(), {
  active: true,
  isSelector: false,
});
</script>
