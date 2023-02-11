<template>
  <div
    class="flex items-center justify-center py-1 pr-1 mx-3 space-x-2 border rounded-md select-none bg-light-header dark:bg-dark-header border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
    :class="{
      'pl-2': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'pl-1': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
  >
    <Icon name="bi:search" size="1em" />
    <input
      v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
      class="w-16 bg-transparent outline-none"
      type="text"
      placeholder="Search"
    />
    <div
      v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
      class="flex pl-1 space-x-1"
    >
      <div
        class="w-5 h-5 text-sm text-center rounded-md bg-light-special-text dark:bg-dark-special-text text-light-header dark:text-dark-header"
      >
        /
      </div>
      <div
        class="h-5 text-sm text-center rounded-md w-7 bg-light-special-text dark:bg-dark-special-text text-light-header dark:text-dark-header"
      >
        ⌘k
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebar = useSidebar();
</script>
