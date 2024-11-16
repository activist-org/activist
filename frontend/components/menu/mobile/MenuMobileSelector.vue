<template>
  <MenuLinkWrapper
    :to="routeUrl"
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
          v-if="iconUrl"
          class="mb-1 h-5 w-5 flex-shrink-0"
          :name="iconUrl"
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
  routeUrl: string;
  iconUrl: string;
  selected: boolean;
  active: boolean;
}>();
</script>
