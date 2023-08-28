<template>
  <MenuLinkWrapper
    :to="routeURL"
    :active="active"
    :selected="selected"
    :linkClasses="{
      'rounded-none border-t': true,
      'border-light-section-div dark:border-dark-section-div': !selected,
      'border-dark-section-div dark:border-light-section-div': selected,
    }"
  >
    <div
      class="relative z-0 flex flex-col items-center justify-center w-full text-sm font-medium text-center"
    >
      <span>
        <Icon
          v-if="iconURL"
          :name="iconURL"
          class="flex-shrink-0 w-5 h-5 mb-1"
        />
      </span>

      <p class="select-none whitespace-nowrap hover:light-menu-selection">
        {{ $t(label) }}
      </p>
    </div>
  </MenuLinkWrapper>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  routeURL: string;
  iconURL: string;
  selected: boolean;
  active: boolean;
}>();
</script>
