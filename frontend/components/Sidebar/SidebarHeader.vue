<template>
  <header
    class="sticky top-0 pl-1 bg-light-header dark:bg-dark-header transition-all duration-500"
    :class="{
      'w-48': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
  >
    <div class="flex items-center pt-4 pb-2 pl-4 pr-6">
      <div
        class="relative z-0 h-8"
        :class="{
          'w-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-8': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <IconsActivist
          v-if="sidebar.collapsed == true && sidebar.collapsedSwitch == true"
          class="absolute inset-0 flex items-center justify-center -ml-1 z-1 overflow-clip"
        />
        <LogosActivist
          v-else
          class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
        />
      </div>
      <!-- @mouseover.stop cancels the sidebar expansion for the button. -->
      <div class="absolute -right-3" @mouseover.stop>
        <button
          class="flex items-center justify-center border-2 rounded-full transition duration-100 w-7 h-7 bg-light-interactive dark:bg-dark-interactive border-light-content dark:border-dark-content hover:bg-light-distinct dark:hover:bg-dark-distinct active:bg-light-interactive dark:active:bg-dark-interactive text-light-content dark:text-dark-content hover:text-light-special-text dark:hover:text-dark-special-text hover:border-light-special-text dark:hover:border-dark-special-text"
          @click="sidebar.toggleCollapsedSwitch()"
        >
          <div
            class="pb-[2px]"
            :class="{
              'pr-[2px]': sidebar.collapsedSwitch == false,
              'pl-[2px]': sidebar.collapsedSwitch == true,
            }"
          >
            <Icon
              v-if="sidebar.collapsedSwitch == false"
              name="bi:chevron-left"
              size="1.25em"
            />
            <Icon
              v-if="sidebar.collapsedSwitch == true"
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
