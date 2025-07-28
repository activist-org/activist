<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="focus-brand rounded-md bg-section-div fill-layer-1 p-2 text-primary-text"
  >
    <button @click="toggle" class="flex w-full justify-between">
      {{ label }}
      <Icon
        :name="IconMap.CHEVRON_DOWN"
        size="1.4em"
        class="transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>
    <div v-if="isOpen" class="bg-section-div text-primary-text">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

interface Props {
  isOpen?: boolean;
  label: string;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
});

const isOpen = ref(props.isOpen);
const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>
