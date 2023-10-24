<template>
  <div @click="toggleDropdown">
    <div
      ref="topComponent"
      class="flex items-center justify-between pl-2 pr-3 border topic-marker w-max h-max bg-light-cta-orange text-light-text border-light-text dark:bg-dark-cta-orange/10 dark:border-dark-cta-orange dark:text-dark-cta-orange hover:bg-light-cta-orange-hover hover:dark:bg-dark-cta-orange/25 hover:cursor-pointer active:bg-light-cta-orange active:dark:bg-dark-cta-orange/10 shadow-sm shadow-zinc-700"
      :class="{ 'rounded-lg': isRounded }"
    >
      <Icon
        v-show="hasIcon"
        class="flex-shrink-0 w-5 h-5 my-1 rounded-full"
        :name="iconName"
        size="1em"
      />
      <p class="pl-2 text-base font-bold text-center select-none">
        {{ topic }}
      </p>
      <Icon
        class="ml-2 flex-shrink-0 w-5 h-5 my-1 rounded-full transition ease-in-out duration-500"
        :class="{ 'rotate-180': showDropdown }"
        name="bi:chevron-down"
        size="1em"
      />
    </div>
    <div v-if="showDropdown">
      <div
        class="mt-1.5 border bg-light-cta-orange text-light-text border-light-text dark:bg-dark-cta-orange/10 dark:border-dark-cta-orange dark:text-dark-cta-orange active:bg-light-cta-orange active:dark:bg-dark-cta-orange/10 shadow-sm shadow-zinc-700"
        :class="{ 'rounded-lg': isRounded}"
        :style="{ width: topComponentWidth + 'px' }"
      >
        <ul>
          <li
            v-for="(item, index) in items"
            @click="selectItem(item)"
            :key="index"
            class="px-2 py-1 text-center border-light-text dark:border-dark-text hover:bg-light-cta-orange-hover hover:dark:bg-dark-cta-orange/25 hover:cursor-pointer active:bg-light-cta-orange active:dark:bg-dark-cta-orange/10"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const showDropdown = ref(false);
const topComponent = ref<HTMLElement | null>(null);
const topComponentWidth = computed(() => topComponent.value?.clientWidth || 0);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectItem = (item: string) => {
  console.log("Item selecionado:", item);
  showDropdown.value = false;
};

defineProps<{
  topic: string;
  hasIcon?: boolean;
  iconName?: string;
  isRounded?: boolean;
  items: string[];
}>();
</script>
