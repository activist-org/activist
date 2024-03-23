<template>
  <MenuLinkWrapper
    :to="routeURL"
    :selected="selected"
    :linkClasses="{
      'rounded-none border-t': true,
      'border-light-section-div dark:border-dark-section-div': !selected,
      'border-dark-section-div dark:border-light-section-div': selected,
    }"
  >
    <div
      class="relative z-0 flex w-full flex-col items-center justify-center text-center text-sm font-medium"
    >
      <span>
        <Icon
          v-if="iconURL"
          class="mb-1 h-5 w-5 flex-shrink-0"
          :name="iconURL"
        />
      </span>
      <p class="hover:light-menu-selection select-none whitespace-nowrap">
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
