<template>
  <header
    class="sticky top-0 pl-1 bg-light-header dark:bg-dark-header transition-all duration-500"
    :class="{
      'w-48': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
  >
    <div class="flex items-center pt-4 pb-2 pl-4 pr-6 border">
      <div
        class="relative z-0 h-8"
        :class="{
          'w-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-6': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <IconsActivist
          class="absolute inset-0 flex flex-shrink-0 items-center justify-center z-1 pt-2 h-8 w-6 overflow-clip border"
        />
        <Transition>
          <LogosActivist
            v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
            class="absolute inset-0 flex flex-shrink-0 items-center justify-center z-1 h-8 w-32 overflow-clip border"
        />
        </Transition>
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

<style>
.v-enter-active {
  transition: opacity 0.25s ease;
  transition-delay: 0.125s;
}
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-from .inner {
  transition-delay: 0.25s;
}
</style>