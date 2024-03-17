<template>
  <header
    class="w-full pl-1 transition-all duration-500 bg-light-layer-1 dark:bg-dark-layer-1"
  >
    <div class="flex items-center pt-3 pb-2 pl-[0.85rem] pr-6">
      <div
        class="relative z-0 h-8"
        :class="{
          'w-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-6': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <IconActivist
          class="absolute inset-0 flex items-center justify-center flex-shrink-0 w-[1.3em] h-8 z-1 overflow-clip"
          :class="{
            hidden:
              sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          }"
        />
        <Transition>
          <LogoActivist
            v-if="
              sidebar.collapsed == false || sidebar.collapsedSwitch == false
            "
            class="absolute inset-0 flex items-center justify-center flex-shrink-0 w-32 h-8 z-1 overflow-clip"
            color="fill-light-text-over-layer-2 dark:fill-dark-text-over-layer-2 hover:fill-light-distinct-text-over-layer-2 hover:dark:fill-dark-distinct-text-over-layer-2"
          />
        </Transition>
      </div>
      <!-- @mouseover.stop cancels the sidebar expansion for the button. -->
      <div @mouseover.stop class="absolute -right-0">
        <button
          @click="
            sidebar.toggleCollapsedSwitch();
            emit('toggle-pressed');
          "
          class="flex items-center justify-center transition duration-200 w-7 h-7 focus-brand outline-offset-0"
          :class="{
            'pr-0.5 -rotate-180': sidebar.collapsedSwitch == false,
            'pl-0.5 pb-1': sidebar.collapsedSwitch == true,
          }"
          :aria-label="
            $t('components.sidebar-left-header.sidebar-collapse-aria-label')
          "
        >
          <SidebarToggle chevronDirection="right" iconSize="1.4em" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const sidebar = useSidebar();
const emit = defineEmits(["toggle-pressed"]);
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
