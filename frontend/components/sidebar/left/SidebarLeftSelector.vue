<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MenuLinkWrapper :id="id" :to="routeUrl" :selected="selected">
    <div
      class="group relative z-0 flex w-full items-center space-x-2 text-left text-sm font-medium"
    >
      <span class="pl-1">
        <Icon
          v-if="iconUrl"
          class="h-5 w-5 flex-shrink-0"
          :class="{
            'dark:group-hover:fill-cta-orange': !selected, 
            'fill-layer-1': selected,
          }"
          :name="iconUrl"
        />
      </span>
      <Transition>
        <p
          v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
          class="select-none whitespace-nowrap"
          :class="{
            'dark:group-hover:text-cta-orange': !selected,
            'text-layer-1': selected,
          }"
        >
          <span class="sr-only">{{ $t("i18n._global.navigate_to") }}</span>
          {{ $t(label) }}
        </p>
        <p v-else class="sr-only">
          {{ $t("i18n._global.navigate_to") }} {{ $t(label) }}
        </p>
      </Transition>
    </div>
  </MenuLinkWrapper>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  routeUrl: string;
  iconUrl: string;
  selected: boolean;
  id?: string;
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
