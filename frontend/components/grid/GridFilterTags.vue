<template>
  <div v-if="tags && tags.length > 0" class="h-fit w-full">
    <div class="flex space-x-3">
      <div v-for="(option, index) in tags" ref="switches" :key="index" class="flex items-center">
        <Switch v-model="selected[option]" @keydown="keyboardEvent($event)" v-slot="{ checked }" as="template">
          <div
            class="style-cta elem-shadow-sm flex h-max w-max cursor-pointer items-center justify-between space-x-2 border rounded-lg py-1 px-4 sm:py-0 sm:px-2"
            :class="{
              'style-cta': checked,
              'style-cta-secondary': !checked,
            }"
          >
            <div class="flex items-center">
              <p class="select-none text-center text-base font-bold">
                {{ option }}
              </p>
            </div>
            <Icon v-if="checked" name="bi:x-lg" size="20" />
          </div>
        </Switch>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@headlessui/vue'
defineProps<{
  tags: string[];
}>();

interface SelectedOptions {
  [key: string]: boolean;
}

const selected = ref<SelectedOptions>({})
const switches = ref<(HTMLInputElement | null)[]>([]);

const keyboardEvent = (e: KeyboardEvent) => {
  const currentIndex = switches.value.findIndex(s => s === document.activeElement?.parentElement);
  const previousIndex = (currentIndex - 1 + switches.value.length) % switches.value.length;
  const nextIndex = (currentIndex + 1) % switches.value.length;
  
  switch (e.code) {
    case "ArrowUp":
    case "ArrowLeft":
      (switches.value[previousIndex]?.childNodes[2] as HTMLInputElement).focus();
      break;
    case "ArrowDown":
    case "ArrowRight":
      (switches.value[nextIndex]?.childNodes[2] as HTMLInputElement).focus();
      break;
  }
};
</script>
