<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div v-if="tags && tags.length > 0" class="h-fit w-full">
    <div class="flex space-x-3">
      <div
        v-for="(tag, index) in tags"
        ref="switches"
        :key="index"
        class="flex items-center"
      >
        <Switch
          v-model="selected[tag]"
          @keydown="keyboardEvent($event)"
          v-slot="{ checked }"
          as="template"
        >
          <div
            class="style-cta elem-shadow-sm flex h-max w-max cursor-pointer items-center justify-between space-x-2 rounded-lg border px-4 py-1 sm:px-3 sm:py-0"
            :class="{
              'style-cta': checked,
              'style-cta-secondary': !checked,
            }"
          >
            <div class="flex items-center">
              <p class="select-none text-center text-base font-bold">
                {{ tag }}
              </p>
            </div>
            <Icon v-if="checked" :name="IconMap.X_LG" size="20" />
          </div>
        </Switch>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Switch } from "@headlessui/vue";
import { ref } from "vue";

import { IconMap } from "~/types/icon-map";

defineProps<{
  tags: string[];
}>();

interface SelectedOptions {
  [key: string]: boolean;
}

const selected = ref<SelectedOptions>({});
const switches = ref<(HTMLInputElement | null)[]>([]);

const keyboardEvent = (e: KeyboardEvent) => {
  const currentIndex = switches.value.findIndex(
    (s) => s === document.activeElement?.parentElement
  );
  const previousIndex =
    (currentIndex - 1 + switches.value.length) % switches.value.length;
  const nextIndex = (currentIndex + 1) % switches.value.length;

  let currentSwitch: HTMLElement | null = null;

  switch (e.code) {
    case "ArrowUp":
    case "ArrowLeft":
      (
        switches.value[previousIndex]?.childNodes[2] as HTMLInputElement
      ).focus();
      break;
    case "ArrowDown":
    case "ArrowRight":
      (switches.value[nextIndex]?.childNodes[2] as HTMLInputElement).focus();
      break;
    case "Enter":
      currentSwitch = switches.value[currentIndex];
      if (currentSwitch && currentSwitch.childNodes.length >= 3) {
        const tag = currentSwitch.childNodes[2]?.textContent?.trim() || "";
        selected.value[tag] = !selected.value[tag];
      }
      break;
  }
};
</script>
