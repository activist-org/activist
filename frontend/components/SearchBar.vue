<template>
  <div
    class="flex items-center justify-center py-1 pr-1 mx-3 space-x-2 border rounded-md select-none bg-light-header dark:bg-dark-header border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
    :class="{
      'pl-2': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'pl-1': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
  >
    <Icon name="bi:search" size="1em" class="my-1" />
    <input
      v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
      class="w-16 bg-transparent outline-none"
      type="text"
      placeholder="Search"
    />
    <Transition>
      <div
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        class="flex pl-1 space-x-1"
      >
        <div
          class="w-5 h-5 text-sm text-center rounded-md bg-light-highlight dark:bg-dark-highlight text-light-special-text dark:text-dark-special-text"
          v-bind:title="$device.isMacOS ? 'Search:/\nJump to: ⌘ + K' : 'Search: /\nJump to: Ctrl + K'"
        >
          <span class="font-semibold"></span> /
        </div>
        <div
          v-bind:title="$device.isMacOS ? 'Search: /\nJump to: ⌘ + K' : 'Search: /\nJump to: Ctrl + K'"
          class="w-5 h-5 text-sm text-center rounded-md bg-light-highlight dark:bg-dark-highlight text-light-special-text dark:text-dark-special-text"
        >
          <span class="font-semibold"></span> 
          <span v-if="$device.isMacOS">⌘k</span>
          <span v-else>⌃k</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const sidebar = useSidebar();
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* Style for tooltip text */
[data-title]::before {
  content: attr(data-title);
  display: inline-block;
  position: absolute;
  left: -50%;
  bottom: calc(100% + 0.5rem);
  padding: 0.5rem;
  background-color: #1f2937;
  color: #fff;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  z-index: 9999;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.25s ease;
  transform: translateX(-50%);
}

[data-title]:hover::before {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(-0.5rem);
}
</style>