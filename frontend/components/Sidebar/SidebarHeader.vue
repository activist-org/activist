<template>
  <header
    class="sticky top-0 ml-1 bg-light-header dark:bg-dark-header"
    :class="{
      'w-48': sidebar.collapsed == false,
      'w-16': sidebar.collapsed == true,
    }"
  >
    <div class="flex items-center pt-4 pb-2 pl-4 pr-6">
      <div
        class="relative z-0"
        :class="{
          'w-32 h-8': sidebar.collapsed == false,
          'w-8 h-8': sidebar.collapsed == true,
        }"
      >
        <IconsActivist
          v-if="sidebar.collapsed"
          class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
        />
        <LogosActivist
          v-else
          class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
        />
      </div>
      <div class="absolute -right-3">
        <button
          class="items-center justify-center transition duration-100 border-2 rounded-full w-7 h-7 bg-light-interactive dark:bg-dark-interactive border-light-content dark:border-dark-content hover:bg-light-distinct dark:hover:bg-dark-distinct active:bg-light-interactive dark:active:bg-dark-interactive text-light-content dark:text-dark-content hover:text-light-special-text dark:hover:text-dark-special-text hover:border-light-special-text dark:hover:border-dark-special-text"
          @click="sidebar.toggleCollapsed()"
        >
          <div
            class="pb-[2px]"
            :class="{
              'pr-[2px]': sidebar.collapsed == false,
              'pl-[2px]': sidebar.collapsed == true,
            }"
          >
            <Icon
              v-if="sidebar.collapsed == false"
              name="bi:chevron-left"
              size="1.25em"
            />
            <Icon
              v-if="sidebar.collapsed == true"
              name="bi:chevron-right"
              size="1.25em"
            />
          </div>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const sidebar = useSidebar();
</script>
