<template>
  <div class="w-full h-fit">
    <div class="flex flex-row">
      <NuxtLink
        v-for="s in selectors"
        class="w-full justify-center flex px-3 py-1 border-l-[1px] border-y-[1px] border-light-text dark:border-dark-text"
        :class="{
          'bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct hover:bg-light-menu-selection/90 dark:hover:bg-dark-menu-selection/90':
            s === selected,
          'bg-light-header dark:bg-dark-header text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight':
            s !== selected,
        }"
        :to="localePath(links[selectors.indexOf(s)])"
      >
        {{ s }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectors: string[];
  links: string[];
  selected: string;
}>();
</script>
