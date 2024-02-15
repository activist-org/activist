<template>
  <MenuLinkWrapper :to="routeURL" :selected="selected">
    <div
      class="relative z-0 flex items-center w-full text-sm font-medium text-left space-x-2"
    >
      <span class="pl-1">
        <Icon v-if="iconURL" class="flex-shrink-0 w-5 h-5" :name="iconURL" />
      </span> 
      <Transition>
        <p
          v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
          class="select-none whitespace-nowrap hover:light-menu-selection"
        >
          {{ $t(label) }}
        </p>
      </Transition>
    </div>
  </MenuLinkWrapper>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  routeURL: string;
  iconURL: string;
  selected: boolean;
}>();

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
