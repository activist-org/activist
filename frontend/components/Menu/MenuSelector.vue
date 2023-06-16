<template>
  <MenuLinkWrapper
        :to="btnURL"
        :active="active"
        :selected="selected"
    >
    <div
      class="relative z-0 flex items-center w-full text-sm font-medium text-left space-x-2"
    >
      <span class="width-1/6"
        ><Icon v-if="iconURL" :name="iconURL" class="flex-shrink-0 w-5 h-5"
      /></span>
      <Transition>
        <p
          v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
          class="select-none width-5/6 whitespace-nowrap hover:light-menu-selection"
        >
          {{ $t(btnText) }}
        </p>
      </Transition>
    </div>
  </MenuLinkWrapper>
</template>

<script setup lang="ts">
defineProps<{
  iconURL: string;
  btnText: string;
  btnURL: string;
  selected: boolean;
  active: boolean;
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
