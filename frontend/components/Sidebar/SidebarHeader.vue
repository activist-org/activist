<template>
  <header
    class="sticky top-0 pl-1 transition-all duration-500 bg-light-header dark:bg-dark-header"
    :class="{
      'w-48': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
  >
    <!-- @mouseover.stop cancels the sidebar expansion for the button. -->
    <div class="absolute -right-0 -pt-2" @mouseover.stop>
      <button
        class="flex items-center justify-center transition duration-100 w-7 h-7 text-light-special-text dark:text-dark-special-text hover:text-light-text dark:hover:text-dark-text focus-brand"
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
            name="tabler:arrow-bar-to-left"
            size="1.5em"
          />
          <Icon
            v-if="sidebar.collapsedSwitch == true"
            name="tabler:arrow-bar-to-right"
            size="1.5em"
          />
        </div>
      </button>
    </div>
    <div class="flex items-center pt-3 pb-2 pl-4 pr-6">
      <div
        class="relative z-0 h-8"
        :class="{
          'w-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-6': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <IconsActivist
          class="absolute inset-0 flex items-center justify-center flex-shrink-0 w-[1.3em] h-8 z-1 overflow-clip"
          color="fill-light-text-over-header dark:fill-dark-text-over-header hover:fill-light-special-text-over-header hover:dark:fill-dark-special-text-over-header"
        />
        <Transition>
          <LogosActivist
            v-if="
              sidebar.collapsed == false || sidebar.collapsedSwitch == false
            "
            class="absolute inset-0 flex items-center justify-center flex-shrink-0 w-32 h-8 z-1 overflow-clip"
            color="fill-light-text-over-header dark:fill-dark-text-over-header hover:fill-light-special-text-over-header hover:dark:fill-dark-special-text-over-header"
          />
        </Transition>
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
