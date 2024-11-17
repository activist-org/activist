<template>
  <header
    class="bg-layer-1 z-40 w-full pl-1 transition-all duration-500"
    :class="{
      'elem-shadow-sm': atTopShadow,
    }"
  >
    <div class="flex items-center pb-2 pl-[0.85rem] pr-6 pt-3">
      <div
        class="relative z-0 h-8"
        :class="{
          'w-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-6': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <IconActivist
          class="z-1 absolute inset-0 flex h-8 w-[1.3em] flex-shrink-0 items-center justify-center overflow-clip"
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
            class="z-1 absolute inset-0 flex h-8 w-32 flex-shrink-0 items-center justify-center overflow-clip"
            color="fill-primary-text-over-layer-2 hover:fill-distinct-text-over-layer-2"
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
          class="focus-brand flex h-7 w-7 items-center justify-center outline-offset-0 transition duration-200"
          :class="{
            '-rotate-180 pr-0.5': sidebar.collapsedSwitch == false,
            'pb-1 pl-0.5': sidebar.collapsedSwitch == true,
          }"
          :aria-label="
            $t('components.sidebar_left_header.sidebar_collapse_aria_label')
          "
        >
          <SidebarLeftToggle chevronDirection="right" iconSize="1.4em" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  atTopShadow: boolean;
}>();

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
