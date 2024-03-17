<template>
  <div>
    <button
      @click="$emit('toggle')"
      class="relative z-40 focus-brand"
      :aria-label="
        $t('components.sidebar-right-toggle.sidebar-collapse-aria-label')
      "
    >
      <div
        class="flex items-center justify-center w-6 h-6 transition-transform transform duration-200"
        :class="{
          'rotate-180 pb-1': menuOpen,
        }"
      >
        <SidebarToggle chevronDirection="left" iconSize="1.4em" />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  menuOpen: boolean;
}

withDefaults(defineProps<Props>(), {
  menuOpen: false,
});
defineEmits(["toggle"]);
</script>
